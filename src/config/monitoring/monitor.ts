import promClient, { Counter, Gauge } from 'prom-client';
import { Logger } from '../logger';
import { NextFunction, Response } from 'express';

const logger = new Logger('Prometheus');

const registry = promClient.register;

const counter = new Counter({
	name: 'app_requests_total',
	help: 'Total number of requests to the app',
	labelNames: ['app'],
	registers: [registry],
});

const gauge = new Gauge({
	name: 'app_memory_usage_bytes',
	help: 'Amount of memory used by the app in bytes',
	labelNames: ['app'],
	registers: [registry],
});

registry.setDefaultLabels({
	app: 'Boiler-Plate',
});

setInterval(() => {
	const usedMemory = process.memoryUsage().heapUsed;
	gauge.set(usedMemory);
}, 5000);

promClient.collectDefaultMetrics({ register: registry, gcDurationBuckets: [10, 50, 100] });

export const metrics = async (req: Express.RequestWithData, res: Response, next: NextFunction) => {
	try {
		res.setHeader('Content-Type', registry.contentType);
		counter.inc();

		const metrics = await registry.metrics();

		const { values: counterValues } = await counter.get();
		const totalRequests = counterValues[0].value;

		const { values: gaugeValues } = await gauge.get();
		const usedMemoryInMegabytes = gaugeValues[0].value / (1024 * 1024);

		const uptimeInSeconds = process.uptime();
		const uptimeInMinutes = Math.floor(uptimeInSeconds / 60);
		const uptimeInHours = Math.floor(uptimeInMinutes / 60);
		const uptimeInDays = Math.floor(uptimeInHours / 24);
		const uptimeText = `Uptime: ${uptimeInDays} days ${uptimeInHours % 24} hours ${uptimeInMinutes % 60} minutes`;

		const responseText = `Total requests: ${totalRequests}\nMemory usage: ${usedMemoryInMegabytes.toFixed(
			2
		)} MB\n${uptimeText}\n\n${metrics}`;

		logger.info('Metrics requested:');
		res.send(responseText);
	} catch (error) {
		next(error);
	}
};
