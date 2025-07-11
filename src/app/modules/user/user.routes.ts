/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { UserController } from './user.controller';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest.middleware';

/**
 * All Routes
 */
const router = Router();

router.get('/', UserController.getAllUsers);
router.post(
  '/',
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.put(
  '/',
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);

export const UserRoutes = router;
