/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import { IUser } from './user.interface';
import { UserServices } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Gte Login user data
 */
const getMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        const user = await UserServices.getMe(decodedToken.userId);
        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'User data fetched successfully',
            data: user,
        });
    }
);

/**
 * Create user controllers
 */
const createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload: IUser = {
            ...req.body,
            picture: req.file?.path,
        };

        const user = await UserServices.createUser(payload);

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
        const query = req.query;
        const result = await UserServices.getAllUsers(
            query as Record<string, string>
        );

        sendResponse<IUser[]>(res, {
            statusCode: httpStatusCodes.OK,
            message: 'Successfully fetched all users',
            data: result.data,
            meta: result.meta,
        });
    }
);

/**
 * Get Single  User
 */
const getSingleUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const result = await UserServices.getSingleUser(id);
        sendResponse(res, {
            success: true,
            statusCode: httpStatusCodes.CREATED,
            message: 'User Retrieved Successfully',
            data: result.data,
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
        const verifiedToken = req.user as JwtPayload;

        // fields to update
        const payload: IUser = {
            ...req.body,
            picture: req.file?.path,
        };
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
    getSingleUser,
    updateUser,
    getMe,
};
