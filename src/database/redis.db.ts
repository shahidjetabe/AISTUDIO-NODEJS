/**
 * A module that exports a Redis client and a Redis class with functions for setting, expiring, and retrieving session data using Redis.
 * @module redis
 */
import { RedisClientType, createClient } from 'redis';

import { config } from '@config/env/env.config';
import { Logger } from '@config/logger';

const logger = new Logger('Redis');

/**
 * Creates a Redis client with the URL specified in the environment configuration.
 * @constant {RedisClientType}
 */
export const redisClient: RedisClientType = createClient({
	url: config.redis.url,
});

/**
 * Attempts to connect to the Redis client.
 * @async
 * @function
 * @throws {Error} - Throws an error if there is an issue connecting to Redis.
 */
export const redisConnect = async () => {
	try {
		await redisClient.connect();
	} catch (error) {
		logger.error('Error connecting redis');
	}
};
redisClient.on('ready', () => {
	logger.info('Redis connected successfully.');
});
redisClient.on('error', () => {
	logger.error('Error connecting redis.');
});

/**
 * A class with functions for setting, expiring, and retrieving session data using Redis.
 * @class
 */
class Redis {
	/**
	 * Sets session data for a user in Redis.
	 * @async
	 * @function
	 * @param {string} userId - The ID of the user to set session data for.
	 * @param {string} sessionKey - The key for the session data.
	 * @param {object} user - The session data to set for the user.
	 * @throws {Error} - Throws an error if there is an issue setting the session data.
	 */
	setSession = async (userId: string, sessionKey: string, user: object) => {
		try {
			await redisClient.hSet(userId.toString(), sessionKey, JSON.stringify(user));
			// await redisClient.expire(userId.toString(), config.redis.expiry);
		} catch (error) {
			logger.error('Error in redis setSession:', error);
		}
	};

	/**
	 * Expires session data for a user in Redis.
	 * @async
	 * @function
	 * @param {string} userId - The ID of the user to expire session data for.
	 * @param {string} sessionKey - The key for the session data.
	 * @throws {Error} - Throws an error if there is an issue expiring the session data.
	 */
	expireSession = async (userId: string, sessionKey: string) => {
		try {
			await redisClient.hDel(userId.toString(), sessionKey);
		} catch (error) {
			logger.error('Error at session expire:', error);
		}
	};

	/**
	 * Retrieves session data for a user from Redis.
	 * @async
	 * @function
	 * @param {string} userId - The ID of the user to retrieve session data for.
	 * @param {string} sessionKey - The key for the session data.
	 * @returns {object} - Returns the session data as an object.
	 * @throws {Error} - Throws an error if there is an issue retrieving the session data.
	 */
	getSession = async (userId: string, sessionKey: string) => {
		try {
			const sessionData = await redisClient.hGet(userId.toString(), sessionKey);
			if (!sessionData) {
				throw new Error('Something went wrong');
			}
			return JSON.parse(sessionData);
		} catch (error) {
			logger.error('Error at get session:', error);
		}
	};
}

export const redis = new Redis();
