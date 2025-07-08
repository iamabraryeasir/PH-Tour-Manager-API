/**
 * Node Modules
 */
import { Router } from 'express';

/**
 * Local Modules
 */
import { UserRoutes } from '../modules/user/user.routes';

const router = Router();

/**
 * Routes List
 */
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
];

/**
 * Register Routes
 */
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export const AppRouter = router;
