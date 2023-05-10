import { Router } from 'express';

import { adminController, adminValidator } from './index';
import { authorizeAdmin } from '@middlewares/authentication';

const router: Router = Router();

router.route('/login').post(adminValidator.login, adminController.login);
router.route('/all_users').get(authorizeAdmin, adminValidator.fetchAllUsers, adminController.fetchAllUsers);
router.route('/logout').post(authorizeAdmin, adminController.logout);
router.route('/delete_user').delete(authorizeAdmin, adminValidator.deleteUser, adminController.deleteUser);

export const adminRoutes = { path: '/admin', router };
