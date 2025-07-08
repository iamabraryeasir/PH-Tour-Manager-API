/**
 * Node Modules
 */
import express from 'express';
import cors from 'cors';

/**
 * Local Modules
 */
import { AppRouter } from './app/routes';

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

export default app;
