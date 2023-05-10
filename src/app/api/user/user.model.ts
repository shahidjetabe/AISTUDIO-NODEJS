import { Schema, model } from 'mongoose';

import { IUser, USER_MODEL_NAME } from './index';
import { hashPassword } from '@src/utils';

const userSchema = new Schema<IUser.User>(
	{
		name: {
			type: Schema.Types.String,
			trim: true,
		},
		email: {
			type: Schema.Types.String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: Schema.Types.String,
			required: true,
			trim: true,
			minlength: 8,
		},
		phone_number: {
			type: Schema.Types.String,
			required: true,
			match: /^(\+?\d{1,3}[- ]?)?\d{10}$/,
		},
	},
	{
		timestamps: true,
		collection: USER_MODEL_NAME,
	}
);

userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await hashPassword(user.password);
	}

	next();
});

userSchema.methods.toJSON = function () {
	const { password, __v, createdAt, updatedAt, ...userObject } = this.toObject();
	return userObject;
};

export const User = model<IUser.User>(USER_MODEL_NAME, userSchema);
