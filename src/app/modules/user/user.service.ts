/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';
import bcrypt from 'bcryptjs';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';

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
    config.bcryptSaltRound
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

/**
 * Update user service
 */
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  // check if user exists with the userId
  const ifUserExists = await User.findById(userId);
  if (!ifUserExists) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
  }

  // check for role changing
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatusCodes.FORBIDDEN, 'You are not authorized');
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatusCodes.FORBIDDEN, 'You are not authorized');
    }
  }

  // only admin update fields
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatusCodes.FORBIDDEN, 'You are not authorized');
    }
  }

  // rehash password on updates
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      config.bcryptSaltRound
    );
  }

  // final update operation in db
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser?.toObject();
};

export const UserServices = { createUser, getAllUsers, updateUser };
