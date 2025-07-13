/**
 * Node Modules
 */
import cors from 'cors';
import httpStatusCodes from 'http-status-codes';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

/**
 * Local Modules
 */
import { AppRouter } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.middleware';
import { routeNotFound } from './app/middlewares/routeNotFound.middleware';

const app = express();

/**
 * CORS Setup
 */
app.use(cors());

/**
 * Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Home Route
 */
app.get('/', (req: Request, res: Response) => {
  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Welcome to PH Tour Management API',
  });
});

/**
 * Main Routes
 */
app.use('/api/v1', AppRouter);

/**
 * Global Error Handler
 */
app.use(globalErrorHandler);

/**
 * Not Found Route
 */
app.use(routeNotFound);

export default app;
