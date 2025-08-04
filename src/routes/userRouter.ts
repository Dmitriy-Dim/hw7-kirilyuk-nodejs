import express from "express";
import {userController} from "../server.ts";
import {validateUserId} from "../validation/userValidation.js";
import asyncHandler from "express-async-handler";
import {handleValidationErrors} from "../validation/validationMiddleware.js";

export const userRouter = express.Router();

// GET /api/users или /api/users?id=123
userRouter.get('/',
    (req, res, next) => {
        if (req.query.id) {
            return validateUserId[0](req, res, next);
        }
        next();
    },
    handleValidationErrors,
    asyncHandler((req, res) => {
        if(req.query.id) {
            userController.getUserById(req, res);
        } else {
            userController.getAllUsers(req, res);
        }
    })
);

// POST /api/users - создать пользователя
userRouter.post('/',
    asyncHandler((req, res) => {
        userController.addUser(req, res);
    })
);

// DELETE /api/users?id=123 - удалить пользователя
userRouter.delete('/',
    validateUserId,
    handleValidationErrors,
    asyncHandler((req, res) => {
        userController.removeUser(req, res);
    })
);

// PUT /api/users - обновить пользователя
userRouter.put('/',
    asyncHandler((req, res) => {
        userController.updateUser(req, res);
    })
);