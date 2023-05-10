import { generateAccessToken, generateRefreshToken, hashPassword, verifyPassword, verifyToken } from '@src/utils';
import { redis } from '@src/database';
import { IUser, User, USER_SESSION_NAME } from './index';
import { UserType } from '../api.constants';
import { sessionService } from '../session';

class UserService {
	signup = async (req: Express.RequestWithData): Promise<{ user: IUser.User; token: string }> => {
		const { email, password, phone_number, name, confirm_password } = req.data;

		if (password !== confirm_password) {
			throw new Error('Password did not match');
		}

		const userExists = await this.findByEmail(email);
		if (!userExists) {
			const user = await User.create({ email, password, phone_number, name });
			const payload = { id: user._id };
			const token = generateAccessToken(payload);
			await sessionService.addSession(user._id, USER_SESSION_NAME);
			return { user, token };
		}
		throw new Error('Email is already registered.');
	};

	login = async (
		req: Express.RequestWithData
	): Promise<{ user: IUser.User; token: string | undefined; refreshToken: string | undefined }> => {
		const { email, password } = req.data;
		const user = await this.findByEmail(email);
		if (!user) throw new Error('User not found.');

		const validatePassword = await verifyPassword(password, user!.password);
		if (!validatePassword) throw new Error('Wrong password.');

		const payload = { id: user._id, userType: UserType.USER };
		const token = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);

		await redis.expireSession(user._id, USER_SESSION_NAME);
		await sessionService.addSession(user._id, USER_SESSION_NAME);

		return { user, token, refreshToken };
	};

	forgotPassword = async (data: any) => {
		const { email, password } = data;
		const user = await this.findByEmail(email);
		if (!user) throw new Error('User not found.');

		const hashedPassword = await hashPassword(password);

		if (user) {
			await User.findOneAndUpdate({ email }, { $set: { password: hashedPassword } });
		}
	};

	logout = async (userId: string) => {
		await sessionService.logout(userId, USER_SESSION_NAME);
	};

	findByEmail = async (email: string): Promise<IUser.User | null> => {
		const user = await User.findOne({ email });
		return user;
	};

	findById = async (id: string) => {
		const user = await User.findById(id);
		if (!user) throw new Error('User does not exist with this ID.');
		return user;
	};

	updateUser = async (id: string, data: any) => {
		const user = await this.findById(id);
		if (user) {
			const updateUser = await User.findByIdAndUpdate(id, { ...data }, { new: true });
			return updateUser;
		}
	};

	deleteUser = async (id: string) => {
		const user = await this.findById(id);
		if (user) {
			await User.findByIdAndRemove(id);
			await redis.expireSession(user._id, USER_SESSION_NAME);
			return;
		}
	};

	findAll = async () => {
		const users = await User.find({});
		return users;
	};

	generateNewToken = async (token: string) => {
		const decodedToken = verifyToken(token) as { id: string; userType: string };
		const user = await User.findById(decodedToken.id);
		if (user) {
			const payload = { id: decodedToken.id, userType: decodedToken.userType };
			const newAccessToken = generateAccessToken(payload);
			return newAccessToken;
		}
	};
}

export const userService = new UserService();
