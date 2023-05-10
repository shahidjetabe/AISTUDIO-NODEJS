import Redis from 'ioredis';

export const redis = new Redis({
	host: 'localhost',
	port: 6379,
	db: 1,
});

export const setUpRedis = async () => {
	beforeAll(async () => {
		await redis.flushdb();
	});

	afterAll(async () => {
		await redis.quit();
	});
};
