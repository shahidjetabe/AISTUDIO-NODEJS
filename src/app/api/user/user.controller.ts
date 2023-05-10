import { NextFunction, Response } from 'express';

import { userService, Login, SignUp, UpdateUser, UserID } from './index';

/**
 * A class that handles user-related operations.
 * @class
 */
class UserController {
	/**
	 * Creates a new user.
	 *
	 * @swagger
	 * /user/sign_up:
	 *   post:
	 *     description: Creates a new user
	 *     tags: [User]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *               confirm_password:
	 *                 type: string
	 *               phone_number:
	 *                 type: string
	 *               name:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: User created successfully.
	 *       400:
	 *         description: Invalid request body.
	 *       500:
	 *         description: Error while creating user.
	 */
	signup = async (req: Express.RequestWithData<SignUp>, res: Response, _next: NextFunction): Promise<Response> => {
		try {
			const createUser = await userService.signup(req);
			if (createUser) {
				return res.locals.success(createUser, 201, 'Signup successful.');
			} else {
				return res.locals.error(500, 'Signup unsuccessful');
			}
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Logs in a user.
	 *
	 * @swagger
	 * /user/login:
	 *   post:
	 *     description: Log-In a user
	 *     tags: [User]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: User Logged In successfully.
	 *       400:
	 *         description: Invalid request body.
	 *       500:
	 *         description: Error while logging in a user.
	 */
	login = async (req: Express.RequestWithData<Login>, res: Response, _next: NextFunction): Promise<Response> => {
		try {
			const { user, token, refreshToken } = await userService.login(req);
			res.cookie('rToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
			return res.locals.success({ user, token });
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	refreshToken = async (req: Express.RequestWithData<Login>, res: Response, _next: NextFunction) => {
		try {
			const { rToken } = req.cookies;
			const newToken = await userService.generateNewToken(rToken);
			return res.locals.success({ token: newToken });
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Updates a password if user forgets.
	 *
	 * @swagger
	 * /user/forgot_password:
	 *   post:
	 *     description: Updates forgot password
	 *     tags: [User]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Password updated successfully.
	 *       400:
	 *         description: Invalid request body.
	 *       500:
	 *         description: Error while updating a password.
	 */
	forgotPassword = async (req: Express.RequestWithData, res: Response, _next: NextFunction) => {
		try {
			await userService.forgotPassword(req.data);
			return res.locals.success('Password updated successfully.');
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Updates User.
	 *
	 * @swagger
	 * /user/update:
	 *   patch:
	 *     description: Update a user information
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               firstName:
	 *                 type: string
	 *               lastName:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: User Updated successfully.
	 *       400:
	 *         description: Invalid request body.
	 *       500:
	 *         description: Error while updaing a user.
	 */
	update = async (req: Express.RequestWithData<UpdateUser>, res: Response, _next: NextFunction): Promise<Response> => {
		try {
			const updateUser = await userService.updateUser(req.user!.id, req.data);
			return res.locals.success(updateUser);
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Deletes User.
	 *
	 * @swagger
	 * /user/delete:
	 *   delete:
	 *     description: Deletes a user
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User Deleted successfully.
	 *       400:
	 *         description: Invalid request.
	 *       500:
	 *         description: Error while deleting a user.
	 */
	delete = async (req: Express.RequestWithData<UserID>, res: Response, next: NextFunction): Promise<Response> => {
		try {
			await userService.deleteUser(req.user!.id);
			return res.locals.success('User Deleted.');
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Get logged-in User.
	 *
	 * @swagger
	 * /user/info:
	 *   get:
	 *     description: Get a logged in user
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User retrieved successfully.
	 *       400:
	 *         description: Invalid request.
	 *       500:
	 *         description: Error while getting user.
	 */
	getUserById = async (req: Express.RequestWithData<UserID>, res: Response, next: NextFunction): Promise<Response> => {
		try {
			const user = await userService.findById(req.user!.id);
			return res.locals.success(user);
		} catch (error) {
			return res.locals.error(404, error.message);
		}
	};

	// uploadFile = async (req: Express.RequestWithData, res: Response, next: NextFunction) => {
	// 	try {
	// 		return res.locals.success('File uploaded.');
	// 	} catch (error) {
	// 		return res.locals.error(404, error.message);
	// 	}
	// };

	/**
	 * Log-out User.
	 *
	 * @swagger
	 * /user/logout:
	 *   post:
	 *     description: Log-out a user
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User Logged-out.
	 *       400:
	 *         description: Invalid request.
	 *       500:
	 *         description: Error while logging-out user.
	 */
	logout = async (req: Express.RequestWithData<UserID>, res: Response, _next: NextFunction): Promise<Response> => {
		try {
			await userService.logout(req.user!.id);
			return res.locals.success('Logged out successfully.');
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};
}

export const userController = new UserController();
