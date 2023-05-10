import { Document } from 'mongoose';

export namespace IUser {
	export interface User extends Document {
		name: string;
		email: string;
		password: string;
		phone_number: string
	}
}

export interface Login {
	password: string;
	email: string;
}

export interface SignUp {
	email: string;
	password: string;
}

export interface UpdateUser {
	firstName: string;
	lastName: string;
	password: string;
}

export interface UserID {
	id: string;
}

export interface DeleteUser {
	id: string;
}
