import { query, param } from 'express-validator';

export const validateUserId = [
    query('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt({ min: 1, max: 1000 })
        .withMessage('User ID must be a number between 1 and 1000')
        .toInt()
];

export const validateUserIdParam = [
    param('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt({ min: 1, max: 200 })
        .withMessage('User ID must be a number between 1 and 200')
        .toInt()
];

export const validatePostId = [
    param('id')
        .notEmpty()
        .withMessage('Post ID is required')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Post ID must be a number between 1 and 1000')
        .toInt()
];

export const validateUserName = [
    query('userName')
        .notEmpty()
        .withMessage('User name is required')
        .isString()
        .withMessage('User name must be a string')
        .isLength({ min: 1, max: 50 })
        .withMessage('User name must be between 1 and 50 characters')
        .trim()
];