/**
 * Node Modules
 */
import { Router } from 'express';

/*
 * Local Modules
 */
import { Role } from './user.interface';
import { UserController } from './user.controller';
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { multerUpload } from '../../config/multer.config';

/**
 * All Routes
 */
const router = Router();

router.get(
    '/all-users',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    UserController.getAllUsers
);

router.get(
    '/:id',
    checkAuth(...Object.values(Role)),
    UserController.getSingleUser
);

router.post(
    '/register',
    multerUpload.single('file'),
    validateRequest(createUserZodSchema),
    UserController.createUser
);

router.patch(
    '/:userId',
    checkAuth(...Object.values(Role)),
    multerUpload.single('file'),
    validateRequest(updateUserZodSchema),
    UserController.updateUser
);

export const UserRoutes = router;
