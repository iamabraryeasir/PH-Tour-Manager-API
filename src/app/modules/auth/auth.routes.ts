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
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { changePasswordZodSchema } from './auth.validation';

/**
 * Routes
 */
const router = Router();

router.post('/login', AuthController.credentialsLogin);
router.post('/logout', AuthController.logOutUser);
router.post(
  '/refresh-token',
  catchAuth(...Object.values(Role)),
  AuthController.getNewAccessToken
);
router.post(
  '/reset-password',
  catchAuth(...Object.values(Role)),
  validateRequest(changePasswordZodSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
