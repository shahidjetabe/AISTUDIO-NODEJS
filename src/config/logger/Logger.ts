import winston from 'winston';
import { LoggerInterface } from './LoggerInterface';

export class Logger implements LoggerInterface {
	private logger: winston.Logger;

	constructor(private scope: string = 'App') {
		this.logger = winston.createLogger({
			level: 'info',

			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				winston.format.printf(({ level, message, timestamp }) => {
					return `[${timestamp}] [${level}] <${this.scope}> ${message}`;
				}),
				winston.format.colorize({ all: true })
			),
			transports: [new winston.transports.Console()],
		});
	}

	public debug(message: string, ...args: any[]): void {
		this.logger.debug(message, ...args);
	}

	public info(message: string, ...args: any[]): void {
		this.logger.info(message, ...args);
	}

	public warn(message: string, ...args: any[]): void {
		this.logger.warn(message, ...args);
	}

	public error(message: string, ...args: any[]): void {
		this.logger.error(message, ...args);
	}
}
