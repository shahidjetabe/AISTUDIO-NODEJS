import { Response, NextFunction } from 'express';
import { verifyToken, generateAccessToken } from '@src/utils';
import { User } from '@api/user';
import { Logger } from '@src/config/logger';

const logger = new Logger();

let cachedAccessToken: string | null = null;

export const refreshTokenMiddleware = async (req: Express.RequestWithData, res: Response, next: NextFunction): Promise<void> => {
	try {
		const accessToken = req.headers.authorization?.split(' ')[1];

		if (!accessToken) {
			return next();
		}

		try {
			verifyToken(accessToken);
			return next();
		} catch (error) {
			const { rToken } = req.cookies;

			if (!rToken) {
				return next();
			}

			try {
				const decodedToken = verifyToken(rToken) as { id: string; userType: string };
				const user = await User.findById(decodedToken.id);
				if (user) {
					if (!cachedAccessToken) {
						const payload = { id: decodedToken.id, userType: decodedToken.userType };
						cachedAccessToken = generateAccessToken(payload);
					}
					res.header('token', cachedAccessToken);
					req.headers.authorization = `Bearer ${cachedAccessToken}`;
				}
			} catch (error) {
				logger.error(error);
				return next();
			}
		}
	} catch (error) {
		logger.error(error);
		return next();
	}

	return next();
};
