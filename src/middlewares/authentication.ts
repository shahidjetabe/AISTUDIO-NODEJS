import { NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { verifyToken } from '@utils/jwt';
import { UserType } from '@src/app/api/api.constants';
import { redis } from '@src/database';
import { USER_SESSION_NAME } from '@src/app/api/user/user.constants';
import { ADMIN_SESSION_NAME } from '@src/app/api/admin/admin.constants';

export const authorizeUser = async (req: Express.RequestWithData, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization as string;

	if (!authHeader) {
		return res.locals.error(404, 'Authorization header is missing.');
	}
	const [, token] = authHeader.split(' ');
	if (!token) {
		return res.locals.error(404, 'Token is missing');
	}

	try {
		const decodedToken = verifyToken(token) as JwtPayload & { id: string };
		const getSession = await redis.getSession(decodedToken.id, USER_SESSION_NAME);
		req.user = getSession;
		next();
	} catch (error) {
		console.trace(error);
		return res.locals.error(400, error.message);
	}
};

export const authorizeAdmin = async (req: Express.RequestWithData, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization as string;

	if (!authHeader) {
		return res.locals.error(404, 'Authorization header is missing.');
	}
	const [, token] = authHeader.split(' ');
	if (!token) {
		return res.locals.error(404, 'Token is missing');
	}

	try {
		const decodedToken = verifyToken(token) as JwtPayload & { id: string };
		const getSession = await redis.getSession(decodedToken.id, ADMIN_SESSION_NAME);
		req.user = getSession;
		if (decodedToken.userType !== UserType.ADMIN) {
			return res.locals.error(401, 'Admin access routes only');
		}
		next();
	} catch (error) {
		return res.locals.error(400, error.message);
	}
};
