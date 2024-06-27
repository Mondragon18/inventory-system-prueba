const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../core/controllers/auth');

const router = express.Router();

/**
 * @api {post} /auth/register Register User
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiParam {String} email User's email.
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 * @apiParam {String="admin","client"} role User's role.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token JWT token.
 *
 * @apiError {String} error Error message.
 */
router.post('/register', [
    body('email').isEmail(),
    body('username').isString().notEmpty(),
    body('password').isString().isLength({ min: 6 }),
    body('role').isIn(['admin', 'client']),
], register);

/**
 * @api {post} /auth/login Login User
 * @apiName login
 * @apiGroup Auth
 *
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} token JWT token.
 *
 * @apiError {String} error Error message.
 */
router.post('/login', [
    body('email').isEmail(),
    body('password').isString().notEmpty(),
], login);

module.exports = router;