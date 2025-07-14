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
      message: 'Successfully fetched the new access token',
      data: {
        accessToken,
      },
    });
  }
);

/**
 * Get new access token
 */
const logOutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      message: 'User logout successful',
      data: null,
    });
  }
);

/**
 * Reset Password
 */
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    await AuthServices.resetPassword(decodedToken, oldPassword, newPassword);

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      message: 'Password reset successful',
      data: null,
    });
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logOutUser,
  resetPassword,
};
