import { NextFunction, Response } from 'express';

import { adminService, IAdmin } from './index';
import { DeleteUser, UserID } from '../user';

/**
 * A class that handles Admin-related operations.
 * @class
 */
class AdminController {
	/**
	 * Logs in a Admin.
	 *
	 * @swagger
	 * /admin/login:
	 *   post:
	 *     description: Login admin
	 *     tags: [Admin]
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
	 *         description: Admin Logged In successfully.
	 *       400:
	 *         description: Invalid request body.
	 *       500:
	 *         description: Error while logging in a user.
	 */
	login = async (req: Express.RequestWithData<IAdmin.Login>, res: Response, _next: NextFunction) => {
		try {
			const loginUser = await adminService.login(req.data!);
			return res.locals.success(loginUser);
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Get a list of users.
	 *
	 * @swagger
	 * /admin/all_users:
	 *   get:
	 *     description: Get a paginated list of users
	 *     tags: [Admin]
	 *     parameters:
	 *       - in: query
	 *         name: limit
	 *         description: Number of items per page.
	 *         schema:
	 *           type: integer
	 *           default: 10
	 *       - in: query
	 *         name: page
	 *         description: Page number.
	 *         schema:
	 *           type: integer
	 *           default: 1
	 *     responses:
	 *       200:
	 *         description: Users retrieved successfully.
	 *       500:
	 *         description: Error while getting the list of users.
	 */
	fetchAllUsers = async (req: Express.RequestWithData<IAdmin.ListAllUsers>, res: Response, _next: NextFunction) => {
		try {
			const users = await adminService.getAllUsers(req.data!);
			return res.locals.success(users);
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Log-out Admin.
	 *
	 * @swagger
	 * /admin/logout:
	 *   post:
	 *     description: Log-out an admin
	 *     tags: [Admin]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Admin Logged-out.
	 *       400:
	 *         description: Invalid request.
	 *       500:
	 *         description: Error while logging-out user.
	 */
	logout = async (req: Express.RequestWithData<UserID>, res: Response, _next: NextFunction) => {
		try {
			await adminService.logout(req.user!.id);
			return res.locals.success('Logged out successfully.');
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};

	/**
	 * Delete a user by ID
	 *
	 * @swagger
	 * /admin/delete_user:
	 *   delete:
	 *     description: Delete User.
	 *     tags: [Admin]
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               userId:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: User deleted.
	 *       400:
	 *         description: Invalid request body.
	 *       500:
	 *         description: Error while deleting a user.
	 */
	deleteUser = async (req: Express.RequestWithData<DeleteUser>, res: Response, _next: NextFunction) => {
		try {
			await adminService.deleteUserById(req.data!.id);
			return res.locals.success('User deleted.');
		} catch (error) {
			return res.locals.error(400, error.message);
		}
	};
}

export const adminController = new AdminController();
