/**
 * @swagger
 * components:
 *   schemas:
 *     Admin - Login:
 *       description: Admin login
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: something@test.com
 *         password:
 *           type: string
 *           example: Test@123
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin - Delete User:
 *       description: Delete user by ID.
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           example: MongoDB Id
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin - List of users:
 *       description: Paginated list of users. limit and page accepted through query params
 *       example: http://localhost:9000/admin/all_users?limit=10&page=1
 *       properties:
 *         limit:
 *           type: number
 *         page:
 *           type: number
 */
