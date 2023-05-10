import { Router } from 'express';

import { userController, userValidator } from './index';
import { authorizeUser } from '@middlewares/authentication';
import { refreshTokenMiddleware } from '@middlewares/refreshToken';
// import upload from '@src/utils/multer';

const router: Router = Router();
router.use(refreshTokenMiddleware);

router.route('/info').get(authorizeUser, userController.getUserById);
router.route('/sign_up').post(userValidator.signup, userController.signup);
router.route('/forgot_password').patch(userValidator.forgotPassword, userController.forgotPassword);
router.route('/login').post(userValidator.login, userController.login);
router.route('/logout').post(authorizeUser, userController.logout);
router.route('/update').patch(authorizeUser, userValidator.updateUserData, userController.update);
router.route('/delete').delete(authorizeUser, userController.delete);
router.route('/token').get(userController.refreshToken);
// router.route('/files').get(authorizeUser, upload.fields([{ name: 'file', maxCount: 1 }]), userController.uploadFile);

export const userRoutes = { path: '/user', router };
