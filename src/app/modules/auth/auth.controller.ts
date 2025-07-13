/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import { AuthServices } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../errorHelpers/AppError';
import { sendResponse } from '../../utils/sendResponse';
import { setAuthCookie } from '../../utils/setCookie';

/**
 * Credentials login controller logic
 */
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, {
      accessToken: loginInfo.accessToken,
      refreshToken: loginInfo.refreshToken,
    });

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      message: 'User logged in successfully',
      data: {
        ...loginInfo,
      },
    });
  }
);

/**
 * Get new access token
 */
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatusCodes.BAD_REQUEST,
        'No refresh token received from cookies'
      );
    }

    const { accessToken } = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, { accessToken });

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      message: 'Successfully fetched the refresh token',
      data: {
        accessToken,
      },
    });
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
};
