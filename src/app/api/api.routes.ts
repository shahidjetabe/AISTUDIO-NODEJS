import { NextFunction, Request, Response, Router } from 'express';
import { userRoutes } from './user';
import { apiMiddleware } from '@src/middlewares/responseHandler/apiMiddleware';
import { adminRoutes } from './admin';
import { Logger } from '@config/logger';
import { metrics } from '@config/monitoring';

const logger = new Logger();

const router: Router = Router();

router.use(apiMiddleware);

router.use(userRoutes.path, userRoutes.router);
router.use(adminRoutes.path, adminRoutes.router);

/**
 * Get "hello world" message.
 *
 * @swagger
 * /hello:
 *   get:
 *     description: Get "Hello World"
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Hello World.
 *       500:
 *         description: Error while getting message.
 */
router.route('/hello').get((_req: Express.RequestWithData, res: Response, next: NextFunction) => {
	try {
		return res.locals.success('Hello World');
	} catch (error) {
		next(error);
	}
});

router.route('/app_metrics').get(metrics);

router.use((_req: Request, res: Response, _next: NextFunction) => {
	logger.error('Route not found');
	res.locals.error(404, 'Route not found');
});

export const apiV1Routes = { path: '/v1', router };
