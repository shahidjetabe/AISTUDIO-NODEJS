import { generateAccessToken, verifyPassword, paginate } from '@src/utils';
import { redis } from '@src/database';
import { IAdmin, Admin, ADMIN_SESSION_NAME } from './index';
import { userService, User } from '../user';
import { UserType } from '../api.constants';
import { sessionService } from '../session';

class AdminService {
	login = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<{ user: IAdmin.Admin; token: string | undefined }> => {
		const user = await this.findByEmail(email);
		if (!user) throw new Error('User not found.');

		const comparePassword = await verifyPassword(password, user!.password);
		if (!comparePassword) throw new Error('Wrong password.');

		const payload = { id: user._id, userType: UserType.ADMIN };
		const token = generateAccessToken(payload);

		await redis.expireSession(user._id, ADMIN_SESSION_NAME);
		await sessionService.addSession(user._id, ADMIN_SESSION_NAME);

		return { user, token };
	};

	findByEmail = async (email: string): Promise<IAdmin.Admin | null> => {
		const user = await Admin.findOne({ email });
		return user;
	};

	getAllUsers = async ({ limit, page }: IAdmin.ListAllUsers) => {
		const users = await paginate(User, { limit, page });
		return users;
	};

	logout = async (userId: string) => {
		await sessionService.logout(userId, ADMIN_SESSION_NAME);
	};

	deleteUserById = async (userId: string) => {
		await userService.findById(userId);
		await userService.deleteUser(userId);
	};
}

export const adminService = new AdminService();
