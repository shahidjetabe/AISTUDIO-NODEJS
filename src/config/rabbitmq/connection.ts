import amqp from 'amqplib';
import { config } from '../env/env.config';
import { Logger } from '../logger';

const logger = new Logger();

export const connectToRabbitMQ = async (): Promise<amqp.Channel> => {
	const { url, queue } = config.rabbitmq;

	try {
		const connection = await amqp.connect(url);
		const channel = await connection.createChannel();
		await channel.assertQueue(queue, { durable: true });
		logger.info('RabbitMQ started.');
		return channel;
	} catch (error) {
		logger.error('Error connecting to RabbitMQ:', error);
		throw error;
	}
};
