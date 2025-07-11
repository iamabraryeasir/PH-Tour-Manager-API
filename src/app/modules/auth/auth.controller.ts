/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Node Modules
 */
import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

/**
 * Credentials login controller logic
 */
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      message: 'User logged in successfully',
      data: {
        ...loginInfo,
      },
    });
  }
);

export const AuthController = {
  credentialsLogin,
};
