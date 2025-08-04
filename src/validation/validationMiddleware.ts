import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError } from '../errorHandler/HttpError.js';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        throw new HttpError(400, `Validation error: ${errorMessages}`);
    }
    next();
};