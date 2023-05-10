import * as jwt from 'jsonwebtoken';

import { config } from '@config/env/env.config';

/**
 * Generates a JWT token using the payload provided.
 * @function
 * @param {Object} payload - An object containing the payload data to be encoded in the token.
 * @returns {string} - Returns the encoded token as a string.
 * @throws {Error} - Throws an error if there is an issue with generating the token.
 */
export const generateAccessToken = (payload: object): string => {
	try {
		const token = jwt.sign(payload, config.jwt.secret, {
			expiresIn: config.jwt.accessTokenExpirationMinutes as string,
		});
		return token;
	} catch (error) {
		console.error(error);
		throw new Error(error.message);
	}
};

export const generateRefreshToken = (payload: object): string => {
	try {
		const token = jwt.sign(payload, config.jwt.secret, {
			expiresIn: config.jwt.refreshTokenExpirationDays as string,
		});
		return token;
	} catch (error) {
		console.error(error);
		throw new Error(error.message);
	}
};

/**
 * Verifies the validity of a JWT token.
 * @function
 * @param {string} token - The token to be verified.
 * @returns {string | jwt.JwtPayload} - Returns the decoded token payload as an object.
 * @throws {Error} - Throws an error if the token is invalid or expired.
 */
export const verifyToken = (token: string): string | jwt.JwtPayload => {
	return jwt.verify(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): string | jwt.JwtPayload => {
	try {
		return jwt.verify(token, config.jwt.secret);
	} catch (error) {
		console.error(error);
		throw new Error('Invalid refresh token');
	}
};
