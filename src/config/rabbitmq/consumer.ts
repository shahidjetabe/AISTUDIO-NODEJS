import { config } from '../env/env.config';
import { connectToRabbitMQ } from './connection';
import { Logger } from '../logger';

const logger = new Logger('RabbitMQ');

export const consumer = async () => {
	try {
		const { queue } = config.rabbitmq;
		const channel = await connectToRabbitMQ();
		logger.info('RabbitMQ consumer started.');

		const message = await channel.get(queue);

		if (message) {
			try {
				channel.ack(message);
			} catch (err) {
				console.error(err);
				channel.nack(message);
			}
		}
	} catch (err) {
		logger.error(err);
		throw err;
	}
};
