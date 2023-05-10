import Joi from 'joi';

import { validateSchema } from '@middlewares/validator';
import { JEmail, JPassword, JPhone, JString } from '@validators/constant';

const JUser = Joi.object({
	email: JEmail,
	password: JPassword,
	confirm_password: JPassword,
	phone_number: JPhone,
	name: JString,
});

export const userValidator = {
	signup: validateSchema(JUser, 'body'),
	login: validateSchema(JUser, 'body'),
	updateUserData: validateSchema(
		Joi.object({
			firstName: JString.optional(),
			lastName: JString.optional(),
		}),
		'body'
	),
	forgotPassword: validateSchema(JUser, 'body'),
};
