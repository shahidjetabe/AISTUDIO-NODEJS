'use strict';
import app from '@bin/app';
import { config } from '@config/env/env.config';
import { Logger, LoggerInterface } from '@config/logger';
import { connectDB } from '@database/mongodb.db';
import { redisConnect } from '../database';
import { seedAdmin, ADMIN_CREDENTIALS } from '@src/app/api/admin';
// import { connectToRabbitMQ } from '../config/rabbitmq/connection';
// import { consumer } from '../config/rabbitmq/consumer';

const port = config.port || 9000;
const logger: LoggerInterface = new Logger();

let server: any;

(async () => {
	try {
		await connectDB();
		await seedAdmin(ADMIN_CREDENTIALS);
		await redisConnect();

		/* Rabbit MQ connection */
		// await connectToRabbitMQ();
		// await consumer();

		server = app.listen(port, () => {
			logger.info(`App running on port ${port}`);
		});
	} catch (error) {
		logger.error(error);
	}
})();

process.on('SIGTERM', () => {
	console.debug('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		logger.debug('HTTP server closed');
	});
});
