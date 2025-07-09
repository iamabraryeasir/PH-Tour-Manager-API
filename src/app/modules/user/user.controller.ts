/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Node Modules
 */
import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { UserServices } from './user.service';
import { catchAsync } from '../../utils/catchAsync';

/**
 * User Controllers
 */
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    res.status(httpStatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();

    res.status(httpStatusCodes.OK).json({
      success: true,
      message: 'Successfully fetched all users',
      data: users,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
};
