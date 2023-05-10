import { hashPassword } from '@src/utils/password';
import { Logger, LoggerInterface } from '@config/logger';
import { ADMIN_CREDENTIALS, Admin } from './index';

const logger: LoggerInterface = new Logger('Admin');

export const seedAdmin = async (payload: typeof ADMIN_CREDENTIALS) => {
	const findAdmin = await Admin.findOne({ email: payload.email });

	if (findAdmin) {
		logger.info('Admin already exists.');
		return;
	}

	const hashedPassword = await hashPassword(payload.password);

	const seedAdmin = await Admin.create({ email: payload.email, password: hashedPassword });
	logger.info('Seeding Admin User => ', seedAdmin);
	return seedAdmin;
};
