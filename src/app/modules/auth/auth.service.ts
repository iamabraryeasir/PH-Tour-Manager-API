/**
 * Node Modules
 */
import bcryptjs from 'bcryptjs';
import httpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import config from '../../config';

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

  // generate access token
  const jwtPayload = {
    userId: foundUser._id,
    email: foundUser.email,
    role: foundUser.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwtAccessSecret, {
    expiresIn: '1d',
  });

  return {
    email: foundUser.email,
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
