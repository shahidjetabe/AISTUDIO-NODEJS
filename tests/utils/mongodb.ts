import mongoose from 'mongoose';
import { config } from '@config/env/env.config';

export const setupTestDB = () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongoose.url);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});
};
