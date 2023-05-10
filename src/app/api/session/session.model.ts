import { model, Schema } from 'mongoose';
import { SESSION_TABLE_NAME } from './index';
import { UserType } from '../api.constants';

const sessionSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		userType: {
			type: String,
			enum: Object.values(UserType),
			default: UserType.USER,
		},
		status: {
			type: Boolean,
			defaultValue: true,
		},
	},
	{
		timestamps: true,
		collection: SESSION_TABLE_NAME,
	}
);

export const Session = model(SESSION_TABLE_NAME, sessionSchema);
