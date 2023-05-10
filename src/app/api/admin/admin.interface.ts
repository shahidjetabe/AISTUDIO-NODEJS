import { Document } from 'mongoose';

export namespace IAdmin {
	export interface Admin extends Document {
		email: string;
		password: string;
	}

	export interface Login {
		email: string;
		password: string;
	}

	export interface ListAllUsers {
		limit?: number;
		page?: number;
	}
}
