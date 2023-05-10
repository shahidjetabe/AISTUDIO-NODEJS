import { config } from '../env/env.config';
import { Logger } from '../logger/Logger';
import { connectToRabbitMQ } from './connection';

const logger = new Logger('RabbitMQ');

export const publisher = async (data: Record<string, unknown>): Promise<void> => {
	try {
		const channel = await connectToRabbitMQ();
		channel.sendToQueue(config.rabbitmq.queue, Buffer.from(JSON.stringify(data)), { persistent: true });
		logger.info(`Data added to the RabbitMQ queue.`);
	} catch (err) {
		logger.error('Error publishing to RabbitMQ:', err);
		throw err;
	}
};
