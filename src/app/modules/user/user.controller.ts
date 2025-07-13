/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Node Modules
 */
import { JwtPayload } from 'jsonwebtoken';
import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import config from '../../config';
import { IUser } from './user.interface';
import { UserServices } from './user.service';
import { verifyJwtToken } from '../../utils/jwt';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

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
    // userid from params
    const { userId } = req.params;

    // getting jwt access token from middleware
    const verifiedToken = req.user;

    // fields to update
    const payload = req.body;

    // update the user
    const updatedNewUser = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken
    );

    // remove sensitive data
    const { password, auths, isDeleted, ...rest } = updatedNewUser as IUser;

    sendResponse(res, {
      statusCode: httpStatusCodes.CREATED,
      message: 'User updated successfully',
      data: {
        ...rest,
      },
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};
