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
import { TourRoutes } from '../modules/tour/tour.route';
import { BookingRoutes } from '../modules/booking/booking.routes';

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
    {
        path: '/tour',
        route: TourRoutes,
    },
    {
        path: '/booking',
        route: BookingRoutes,
    },
];

/**
 * Register Routes
 */
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export const AppRouter = router;
