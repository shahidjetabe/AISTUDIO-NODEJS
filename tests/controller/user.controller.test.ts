import { setupTestDB } from '../utils/mongodb';
import { Login, SignUp, User, UserID, userController, userService } from '@api/user';
import { Response } from 'express';
import { hashPassword, generateToken, verifyPassword } from '@src/utils';
import { UserType } from '@api/api.constants';
import { redis, setUpRedis } from '../utils/redis';

setupTestDB();
setUpRedis();
jest.mock('@api/user/user.service');

describe('Test user routes.', () => {
	let req: Express.RequestWithData<SignUp>;
	let res: Response;

	beforeEach(async () => {
		(userService.signup as jest.Mock).mockReset();
		req = {
			data: {
				email: 'test@example.com',
				password: 'password123',
			},
			user: {
				id: '1',
			},
		} as Express.RequestWithData<SignUp>;

		res = {
			locals: {
				success: jest.fn(),
				error: jest.fn(),
			},
		} as unknown as Response;

		const hashedPassword = await hashPassword(req.data.password);
		await User.create({ email: req.data.email.toLowerCase(), password: hashedPassword });
		await redis.hset(req.user.id, 'users', JSON.stringify(req.user));
	});

	afterEach(async () => {
		await User.deleteMany();
	});

	describe('Signup', () => {
		beforeEach(() => {
			(userService.signup as jest.Mock).mockReset();
		});

		it('Should create a new user when valid data is sent', async () => {
			const userReq = {
				email: req.data.email.toLowerCase(),
				password: req.data.password,
			};
			const token = 'token';
			const expectedResponse = {
				user: userReq,
				token,
			};

			(userService.signup as jest.Mock).mockResolvedValueOnce(expectedResponse);
			await userController.signup(req, res, jest.fn());

			expect(userService.signup).toHaveBeenCalledWith(req);
			expect(res.locals.success).toHaveBeenCalledWith(expectedResponse, 201, 'Signup successful.');
			expect(res.locals.error).not.toHaveBeenCalled();

			expect.assertions(3);
		});

		it('Should get the correct value from Redis', async () => {
			const value = await redis.hget(req.user.id, 'users');
			expect(value).toEqual(JSON.stringify(req.user));

			expect.assertions(1);
		});

		it('Should fail when invalid email is provided', async () => {
			const invalidEmail = 'test@example';

			const invalidReq = {
				data: {
					email: invalidEmail,
					password: 'password123',
				},
			} as Express.RequestWithData<SignUp>;

			await userController.signup(invalidReq, res, jest.fn());
			expect(res.locals.error).toHaveBeenCalledWith(500, 'Signup unsuccessful');

			expect.assertions(1);
		});
	});

	describe.each([
		['test@example.com', 'password123'],
		['another@example.com', 'differentpassword'],
	])('Login', (email, password) => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		it('should return a successful response when the login is successful', async () => {
			const user = {
				email: email.toLowerCase(),
				password: password,
			};
			const payload = { email: user.email, userType: UserType.USER };
			const token = generateToken(payload);

			const expectedResponse = {
				data: user,
				token,
			};

			(userService.login as jest.Mock).mockResolvedValueOnce(expectedResponse);
			const req = { data: { email, password } } as Express.RequestWithData<Login>;
			await userController.login(req, res, jest.fn());

			expect(userService.login).toHaveBeenCalledWith(req);
			expect(res.locals.success).toHaveBeenCalledWith(expectedResponse);
			expect(res.locals.error).not.toHaveBeenCalled();
		});

		it('should return an error response when non-existing email is provided', async () => {
			const errorMessage = 'User not found.';
			const failureReq = {
				data: {
					email: 'test123@example.com',
					password,
				},
			} as Express.RequestWithData<Login>;

			(userService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
			await userController.login(failureReq, res, jest.fn());

			const user = await User.findOne({ email: failureReq.data.email.toLowerCase() });

			expect(userService.login).toHaveBeenCalledWith(failureReq);
			expect(res.locals.error).toHaveBeenCalledWith(400, errorMessage);
			expect(user).toBeFalsy();
		});

		it('should return an error response when invalid password is provided', async () => {
			const errorMessage = 'Wrong password';
			const failureReq = {
				data: {
					email: 'test@example.com',
					password,
				},
			} as Express.RequestWithData<Login>;

			(userService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
			await userController.login(failureReq, res, jest.fn());

			const user = await User.findOne({ email: failureReq.data.email.toLowerCase() });
			const isValidPassword = await verifyPassword(failureReq.data.password, user.password);

			expect(userService.login).toHaveBeenCalledWith(failureReq);
			expect(res.locals.error).toHaveBeenCalledWith(400, errorMessage);
			expect(isValidPassword).toBeFalsy();
		});
	});

	describe('Get User', () => {
		it('should successfully retrieve a user based on ID', async () => {
			const user = await User.create({
				email: 'johndoe@example.com',
				password: 'password123',
			});

			const req = {
				user: {
					id: user.id,
				},
			} as Express.RequestWithData<UserID>;

			(userService.findById as jest.Mock).mockResolvedValueOnce(user);
			await userController.getUserById(req, res, jest.fn());
			expect(res.locals.success).toHaveBeenCalledWith(user);
		});

		it('should return a 404 error if the user does not exist with ID', async () => {
			(userService.findById as jest.Mock).mockImplementationOnce(() => {
				throw new Error('User does not exist with this ID.');
			});

			const req = {
				user: { id: 'RandomID' },
			} as Express.RequestWithData<UserID>;

			await userController.getUserById(req, res, jest.fn());

			expect(res.locals.error).toHaveBeenCalledWith(404, 'User does not exist with this ID.');
			expect(res.locals.success).not.toHaveBeenCalled();
		});
	});
});
