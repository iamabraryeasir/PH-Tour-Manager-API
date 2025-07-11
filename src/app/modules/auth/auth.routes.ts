/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Module
 */
import { AuthController } from './auth.controller';

/**
 * Routes
 */
const router = Router();

router.post('/login', AuthController.credentialsLogin);

export const AuthRoutes = router;
