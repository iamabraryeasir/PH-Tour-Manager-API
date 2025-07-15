/**
 * Node Modules
 */
import cors from 'cors';
import httpStatusCodes from 'http-status-codes';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import expressSession from 'express-session';

/**
 * Local Modules
 */
import './app/config/passport';
import config from './app/config';
import { AppRouter } from './app/routes';
import { routeNotFound } from './app/middlewares/routeNotFound.middleware';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.middleware';

const app = express();

/**
 * CORS Setup
 */
app.use(cors());

/**
 * Express Session
 */
app.use(
  expressSession({
    secret: config.expressSessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

/**
 * Passport JS for authentication
 */
app.use(passport.initialize());
app.use(passport.session());

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
