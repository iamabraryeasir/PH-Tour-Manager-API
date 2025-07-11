/**
 * Node Modules
 */
import { Router } from 'express';

/*
 * Local Modules
 */
import { Role } from './user.interface';
import { UserController } from './user.controller';
import { catchAuth } from '../../middlewares/checkAuth.middleware';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest.middleware';

/**
 * All Routes
 */
const router = Router();

router.get(
  '/all-users',
  catchAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUsers
);
router.post(
  '/register',
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.put(
  '/',
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);

export const UserRoutes = router;
