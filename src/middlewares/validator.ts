import express, { Request, Response } from 'express';
import Joi from 'joi';

import { Logger } from '@config/logger';

const logger = new Logger();

type RequestDataType = 'body' | 'query' | 'params' | 'header' | ((req: Request) => any);

export const validateSchema = (schema: Joi.ObjectSchema, requestDataType: RequestDataType) => {
	return (req: Express.RequestWithData, res: Response, next: express.NextFunction) => {
		const data = typeof requestDataType === 'function' ? requestDataType(req) : req[requestDataType];
		try {
			const result = Joi.attempt(data, schema);
			req.data = {
				...(req.data || {}),
				...result,
			};
			next();
		} catch (error) {
			const message: string = error.details[0].message.split("'").join('');
			logger.error(message);
			return res.locals.error(400, message.replace(new RegExp('"', 'gi'), ''));
		}
	};
};
