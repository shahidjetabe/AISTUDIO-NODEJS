import Joi from 'joi';

import { validateSchema } from '@middlewares/validator';
import { JEmail, JNumber, JPassword, JString } from '@validators/constant';

const JAdmin = Joi.object({
	email: JEmail,
	password: JPassword,
});

export const adminValidator = {
	login: validateSchema(JAdmin, 'body'),
	deleteUser: validateSchema(
		Joi.object({
			userId: JString.required(),
		}),
		'body'
	),
	fetchAllUsers: validateSchema(
		Joi.object({
			limit: JNumber.optional(),
			page: JNumber.optional(),
		}),
		'query'
	),
};
