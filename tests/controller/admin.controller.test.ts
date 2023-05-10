import { Response } from 'express';

import { adminService, ADMIN_CREDENTIALS, adminController, IAdmin, Admin } from '@api/admin';
import { generateToken, hashPassword, verifyPassword } from '@src/utils';
import { setupTestDB } from 'tests/utils/mongodb';
import { UserType } from '@api/api.constants';

setupTestDB();
jest.mock('@api/admin/admin.service');

describe('Admin Routes', () => {
	let req: Express.RequestWithData<IAdmin.Login>;
	let res: Response;

	beforeAll(async () => {
		const { email, password } = ADMIN_CREDENTIALS;
		const hashedPassword = await hashPassword(password);

		await Admin.create({ email: email.toLowerCase(), password: hashedPassword });

		req = {
			data: {
				email: email.toLowerCase(),
				password: hashedPassword,
			},
		} as Express.RequestWithData<IAdmin.Login>;

		res = {
			locals: {
				success: jest.fn(),
				error: jest.fn(),
			},
		} as unknown as Response;
	});

	afterAll(async () => {
		const { email } = ADMIN_CREDENTIALS;
		await Admin.deleteOne({ email: email.toLowerCase() });
	});

	describe('Admin Login', () => {
		it('should return a successful response when the login is successful', async () => {
			const user = {
				email: req.data.email.toLowerCase(),
				password: req.data.password,
			};
			const payload = { email: user.email, userType: UserType.ADMIN };
			const token = generateToken(payload);

			const expectedResponse = {
				data: user,
				token,
			};

			(adminService.login as jest.Mock).mockResolvedValueOnce(expectedResponse);
			await adminController.login(req, res, jest.fn());
			expect(adminService.login).toHaveBeenCalledWith(req.data);
			expect(res.locals.success).toHaveBeenCalledWith(expectedResponse);
			expect(res.locals.error).not.toHaveBeenCalled();
		});

		it('should return an error response when the login fails', async () => {
			const errorMessage = 'Invalid email or password';
			const failureReq = {
				data: {
					email: req.data.email.toLowerCase(),
					password: 'wrongPassword',
				},
			} as Express.RequestWithData<IAdmin.Login>;

			(adminService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
			await adminController.login(failureReq, res, jest.fn());

			const admin = await Admin.findOne({ email: req.data.email.toLowerCase() });
			const isValidPassword = await verifyPassword(failureReq.data.password, admin.password);

			expect(adminService.login).toHaveBeenCalledWith(failureReq.data);
			expect(res.locals.error).toHaveBeenCalledWith(400, errorMessage);
			expect(admin).toBeTruthy();
			expect(isValidPassword).toBeFalsy();
		});
	});
});
