/**
 * Node Modules
 */
import { NextFunction, Request, Response, Router } from 'express';

/**
 * Local Module
 */
import { Role } from '../user/user.interface';
import { AuthController } from './auth.controller';
import { checkAuth } from '../../middlewares/checkAuth.middleware';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { changePasswordZodSchema } from './auth.validation';
import passport from 'passport';

/**
 * Routes
 */
const router = Router();

router.post('/login', AuthController.credentialsLogin);
router.post('/logout', AuthController.logOutUser);
router.post(
    '/refresh-token',
    checkAuth(...Object.values(Role)),
    AuthController.getNewAccessToken
);
router.post(
    '/reset-password',
    checkAuth(...Object.values(Role)),
    validateRequest(changePasswordZodSchema),
    AuthController.resetPassword
);
router.get(
    '/google',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const redirect = req.query.redirect || '/';
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            state: redirect as string,
        })(req, res);
    }
);
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    AuthController.googleCallbackController
);

export const AuthRoutes = router;
