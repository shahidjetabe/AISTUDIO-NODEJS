import mongoose from 'mongoose';

import { config } from '@config/env/env.config';
import { Logger, LoggerInterface } from '@config/logger';

const logger: LoggerInterface = new Logger('MongoDB');

/**
 * @function connectDB
 * @description A function to connect to the database
 */
export const connectDB = async () => {
	try {
		await mongoose.connect(config.mongoose.url);
		logger.info('Connected to MongoDB');
	} catch (error) {
		logger.error('Error connecting to MongoDB', error);
		process.exit(1);
	}
};
