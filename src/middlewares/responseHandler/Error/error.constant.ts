import { ErrorMessage } from './error.interface';

export const errorMessage = (key: number, messages?: ErrorMessage) => {
	const defaultMessages: ErrorMessage = {
		500: {
			success: false,
			status: 500,
			message: 'Internal server error.',
		},

		404: {
			success: false,
			status: 404,
			message: 'Resource not found.',
		},

		401: {
			success: false,
			status: 401,
			message: 'You are not authorized to access',
		},

		400: {
			success: false,
			status: 400,
			message: 'Bad Request.',
		},

		409: {
			success: false,
			status: 409,
			message: 'This email or phone number is already registered',
		},

		403: {
			success: false,
			status: 403,
			message: 'Forbidden',
		},
	};

	if (messages && messages[key]) {
		return messages[key];
	} else {
		if (!defaultMessages[key]) {
			defaultMessages[key] = {
				success: false,
				status: key,
				message: 'Unknown error.',
			};
		}
		return defaultMessages[key];
	}
};
