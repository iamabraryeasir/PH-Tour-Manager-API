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
import { sendResponse } from '../../utils/sendResponse';
import { IUser } from './user.interface';

/**
 * Create user controllers
 */
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatusCodes.CREATED,
      message: 'User created successful',
      data: {
        name: user.name,
        email: user.email,
      },
    });
  }
);

/**
 * Get all user controller
 */
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse<IUser[]>(res, {
      statusCode: httpStatusCodes.OK,
      message: 'Successfully fetched all users',
      data: result.data,
      meta: result.meta,
    });
  }
);

/**
 * Update user controller
 */
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      statusCode: httpStatusCodes.CREATED,
      message: 'user updated successfully',
      data: {},
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
