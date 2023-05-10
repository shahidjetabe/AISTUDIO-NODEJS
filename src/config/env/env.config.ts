import * as dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: `${process.cwd()}/.env.${process.env.NODE_ENV}` });

interface EnvVars {
	NODE_ENV: 'production' | 'development' | 'local' | 'staging' | 'test';
	APP_URL: string;
	PORT: number;
	MONGODB_URL: string;
	JWT_SECRET: string;
	JWT_ACCESS_EXPIRATION_MINUTES: string;
	REDIS_URL: string;
	REDIS_KEY_EXPIRATION_SECONDS: number;
	RABBITMQ_URL: string;
	RABBITMQ_QUEUE: string;
	JWT_REFRESH_TOKEN_EXPIRATION: string;
}

const envVarsSchema = Joi.object<EnvVars>()
	.keys({
		NODE_ENV: Joi.string()
			.valid('production', 'development', 'local', 'staging', 'test')
			.required()
			.description('NodeJS environment'),
		APP_URL: Joi.string().description('Backend API url'),
		PORT: Joi.number().default(9000),
		MONGODB_URL: Joi.string().required().description('Mongo DB url'),
		JWT_SECRET: Joi.string().required().description('JWT secret key'),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().description('minutes after which access tokens expire'),
		JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().description('JWT refresh token expiry'),
		REDIS_URL: Joi.string().description('Redis URL'),
		REDIS_KEY_EXPIRATION_SECONDS: Joi.number().description('Redis session key expiry time in seconds'),
		RABBITMQ_URL: Joi.string().description('URL for rabbitmq connection'),
		RABBITMQ_QUEUE: Joi.string().description('rabbitmq queue name'),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
	env: envVars.NODE_ENV,
	url: envVars.APP_URL,
	port: envVars.PORT,
	mongoose: {
		url: envVars.MONGODB_URL,
	},
	jwt: {
		secret: envVars.JWT_SECRET,
		accessTokenExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshTokenExpirationDays: envVars.JWT_REFRESH_TOKEN_EXPIRATION,
	},
	redis: {
		url: envVars.REDIS_URL,
		expiry: envVars.REDIS_KEY_EXPIRATION_SECONDS,
	},
	rabbitmq: {
		url: envVars.RABBITMQ_URL,
		queue: envVars.RABBITMQ_QUEUE,
	},
};
