/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { UserController } from './user.controller';
import { createUserZodSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest.middleware';

/**
 * All Routes
 */
const router = Router();

router.get('/', UserController.getAllUsers);
router.post(
  '/register',
  validateRequest(createUserZodSchema),
  UserController.createUser
);

export const UserRoutes = router;
