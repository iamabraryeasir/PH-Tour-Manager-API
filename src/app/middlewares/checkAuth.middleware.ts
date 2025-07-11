/**
 * Node Modules
 */
import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import config from '../config';
import { verifyJwtToken } from '../utils/jwt';
import { AppError } from '../errorHelpers/AppError';
import { Role } from '../modules/user/user.interface';

/**
 * Main Middleware Logic
 */
export const catchAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, 'No token received');
      }

      const verifiedToken = verifyJwtToken(
        accessToken,
        config.jwtAccessSecret
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(401, 'You are not permitted to view the route');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
