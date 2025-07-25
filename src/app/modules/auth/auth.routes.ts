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
import passport from 'passport';
import config from '../../config';

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
    '/change-password',
    checkAuth(...Object.values(Role)),
    AuthController.changePassword
);

router.post('/forgot-password', AuthController.forgotPassword);

router.post(
    '/reset-password',
    checkAuth(...Object.values(Role)),
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
    passport.authenticate('google', {
        failureRedirect: `${config.FRONTEND_URL}/login?error=There is some issue with account. Contact with our support team.`,
    }),
    AuthController.googleCallbackController
);

export const AuthRoutes = router;
