import { Schema, model } from 'mongoose';

import { IAdmin, ADMIN_MODEL_NAME } from './index';

const adminSchema = new Schema<IAdmin.Admin>(
	{
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
		},
	},
	{
		timestamps: true,
		collection: ADMIN_MODEL_NAME,
	}
);

adminSchema.methods.toJSON = function () {
	const { password, __v, createdAt, updatedAt, _id, ...adminObject } = this.toObject();
	return adminObject;
};

export const Admin = model<IAdmin.Admin>(ADMIN_MODEL_NAME, adminSchema);
