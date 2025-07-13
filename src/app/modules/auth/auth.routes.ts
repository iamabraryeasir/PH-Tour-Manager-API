/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Module
 */
import { Role } from '../user/user.interface';
import { AuthController } from './auth.controller';
import { catchAuth } from '../../middlewares/checkAuth.middleware';

/**
 * Routes
 */
const router = Router();

router.post('/login', AuthController.credentialsLogin);
router.post(
  '/refresh-token',
  catchAuth(...Object.values(Role)),
  AuthController.getNewAccessToken
);
router.post('/logout', AuthController.logOutUser);

export const AuthRoutes = router;
