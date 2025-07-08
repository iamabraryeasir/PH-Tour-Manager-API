/**
 * Node Modules
 */
import express from 'express';
import cors from 'cors';

/**
 * Local Modules
 */
import { AppRouter } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.middleware';

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

/**
 * Routes
 */
app.use('/api/v1', AppRouter);

/**
 * Global Error Handler
 */
app.use(globalErrorHandler);

export default app;
