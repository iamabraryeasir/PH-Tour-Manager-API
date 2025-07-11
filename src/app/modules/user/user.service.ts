/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';
import bcrypt from 'bcryptjs';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IAuthProvider, IUser } from './user.interface';
import { User } from './user.model';
import config from '../../config';

/**
 * Create new user service logics
 */
const createUser = async (payload: Partial<IUser>) => {
  // destructuring only the data that we need
  const { email, password, ...rest } = payload;

  // check if is user already registered
  const ifUserExists = await User.findOne({ email });
  if (ifUserExists) {
    throw new AppError(httpStatusCodes.BAD_REQUEST, 'User already exists');
  }

  // hashing the password
  const hashedPassword = await bcrypt.hash(
    password as string,
    parseInt(config.bcryptSaltRound)
  );

  // creating the auth provider for email and pass
  const authProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: email as string,
  };

  // saving the data to database
  const newUser = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    ...rest,
  });

  return newUser;
};

/**
 * Get all user service logic
 */
const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = { createUser, getAllUsers };
