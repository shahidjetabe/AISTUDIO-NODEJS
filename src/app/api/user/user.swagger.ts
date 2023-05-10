/**
 * @swagger
 * components:
 *   schemas:
 *     User-Registration:
 *       description: User Sign-Up
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
 *     User-Login:
 *       description: User Sign-Up
 *       required:
 *         - email
 *         - password
 *       type: object
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
 *     User-Update:
 *       description: Update user.
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 */
