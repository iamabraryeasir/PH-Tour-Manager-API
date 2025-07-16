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
import { createUserTokens } from '../../utils/userTokens';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';

/**
 * Credentials login controller logic
 */
// const credentialsLogin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const loginInfo = await AuthServices.credentialsLogin(req.body);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     passport.authenticate('local', async (error: any, user: any, info: any) => {
//       if (error) {
//         return next(new AppError(httpStatusCodes.UNAUTHORIZED, error));
//       }

//       if (!user) {
//         return next(new AppError(httpStatusCodes.UNAUTHORIZED, info.message));
//       }

//       const userTokens = createUserTokens(user);

//       setAuthCookie(res, {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//       });

//       // remove sensitive data
//       const { password: ps, auths, ...rest } = user.toObject();

//       sendResponse(res, {
//         statusCode: httpStatusCodes.OK,
//         message: 'User logged in successfully',
//         data: {
//           accessToken: userTokens.accessToken,
//           refreshToken: userTokens.refreshToken,
//           user: rest,
//         },
//       });
//     })(req, res, next);
//   }
// );

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

    await AuthServices.resetPassword(
      decodedToken as JwtPayload,
      oldPassword,
      newPassword
    );

    sendResponse(res, {
      statusCode: httpStatusCodes.OK,
      message: 'Password reset successful',
      data: null,
    });
  }
);

/**
 * Google OAuth Logic Controller
 */
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : '';
    if (redirectTo.startsWith('/')) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${config.frontendUrl}/${redirectTo}`);
  }
);

export const AuthController = {
  // credentialsLogin,
  getNewAccessToken,
  logOutUser,
  resetPassword,
  googleCallbackController,
};
