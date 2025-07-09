import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.get('/', UserController.getAllUsers);
router.post('/register', UserController.createUser);

export const UserRoutes = router;
