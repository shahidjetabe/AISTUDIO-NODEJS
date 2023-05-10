import { NextFunction, Response } from 'express';

import { Success } from './Success/success.interface';
import { errorMessage } from './Error/error.constant';

export function apiMiddleware(req: Express.Request, res: Response, next: NextFunction) {
	res.locals.success = function (data: object | string, status: number = 200, message?: string) {
		const successMessage: Success = {
			success: true,
			status,
			message,
			data,
		};
		res.status(status).json(successMessage);
	};

	res.locals.error = function (key: number, customMessage?: string) {
		const error = errorMessage(key);
		const status = error.status;
		const message = customMessage ?? error.message;
		res.status(status).json({ success: false, status, message });
	};
	next();
}
