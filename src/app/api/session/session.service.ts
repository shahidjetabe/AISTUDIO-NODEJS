import { redis } from '@src/database';
import { Session } from './index';

class SessionService {
	addSession = async (userId: string, sessionKey: string) => {
		const session = await Session.create({ userId, userType: sessionKey, status: true });
		await redis.setSession(userId, sessionKey, { id: session.userId, userType: sessionKey });
	};

	logout = async (userId: string, sessionKey: string) => {
		await Session.findOneAndUpdate({ userId }, { status: false });
		await redis.expireSession(userId.toString(), sessionKey);
	};
}

export const sessionService = new SessionService();
