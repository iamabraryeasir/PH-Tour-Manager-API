/**
 * Node Modules
 */
import bcryptjs from 'bcryptjs';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { createUserTokens } from '../../utils/userTokens';

/**
 * Credentials login service logic
 */
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  // check if user exists
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      'Invalid email or password'
    );
  }

  // match the password
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    foundUser.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatusCodes.BAD_REQUEST,
      'Invalid email or password'
    );
  }

  // generate tokens
  const { accessToken, refreshToken } = createUserTokens(foundUser);

  // remove sensitive data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: ps, auths, ...rest } = foundUser.toObject();

  return {
    user: rest,
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
