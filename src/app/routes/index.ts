/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { DivisionRoutes } from '../modules/division/division.routes';

const router = Router();

/**
 * Routes List
 */
const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/division',
        route: DivisionRoutes,
    },
];

/**
 * Register Routes
 */
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export const AppRouter = router;
