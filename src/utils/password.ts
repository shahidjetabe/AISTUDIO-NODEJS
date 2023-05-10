import { genSalt, hash, compare } from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
	const salt = await genSalt(10);
	return await hash(password, salt);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
	return await compare(password, hashedPassword);
};
