import { NextFunction, Response } from 'express';
import { Logger } from '@config/logger';
import { IRequest, IRequestLog } from '@src/app/app.interface';

const logger = new Logger('Request');

export const logRequests = () => {
	return (req: IRequest, res: Response, next: NextFunction): void => {
		const { method, url, body, ip } = req;
		const log: IRequestLog = { method, url, body, ip };

		res.on('finish', () => {
			const { statusCode } = res;

			if (statusCode >= 400) {
				logger.error(`
	------------------------------ Request Start ------------------------------
        IP address - ${log.ip}
        Method - ${log.method}
        EndPoint - ${log.url}
        Body - ${JSON.stringify(log.body)}
        Response status - ${statusCode}
        ------------------------------- Request End -------------------------------`);
			} else {
				logger.info(`
	------------------------------- Request Start ------------------------------
        IP address - ${log.ip}
        Method - ${log.method}
        EndPoint - ${log.url}
        Body - ${JSON.stringify(log.body)}
        Response status - ${statusCode}
        ------------------------------- Request End -------------------------------`);
			}
		});

		next();
	};
};
