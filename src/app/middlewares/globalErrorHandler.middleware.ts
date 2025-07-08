/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Node Modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import config from '../config';

/**
 * Middleware Logic
 */
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 500;
  const message = error?.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: config.nodeEnv === 'development' ? error.stack : null,
  });
};
