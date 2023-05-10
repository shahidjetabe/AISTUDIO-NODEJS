import { Router } from 'express';
// import { adminRoutes } from './api/admin';
import { apiV1Routes } from './api/api.routes';

const router: Router = Router();

router.use(apiV1Routes.path, apiV1Routes.router);
// router.use(adminRoutes.path, adminRoutes.router);

export default router;
