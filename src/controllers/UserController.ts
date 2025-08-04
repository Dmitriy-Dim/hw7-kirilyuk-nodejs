import {UserService} from "../services/UserService.ts";
import {isUserType} from "../utils/tools.ts";
import {User} from "../model/userTypes.ts";
import {Request, Response} from "express";
import {myLogger} from "../utils/logger.ts";
import {HttpError} from "../errorHandler/HttpError.js";

export class UserController{
    constructor(private userService: UserService) { }

    addUser(req: Request, res: Response) {
        const body = req.body;

        if(!isUserType(body)){
            throw new HttpError(400, 'Bad request: wrong params!');
        }

        const user = body as User;
        this.userService.addUser(user);

        res.status(201).json({
            message: "User created successfully",
            user: user
        });

        myLogger.log(`User with id ${user.id} was added`);
        myLogger.save(`User with id ${user.id} was added`);
    }

    removeUser(req: Request, res: Response) {
        const param = req.query.id as string;

        if(!param || Number.isNaN(parseInt(param))){
            throw new HttpError(400, 'Bad request: wrong params!');
        }

        const id = parseInt(param);
        const removed = this.userService.removeUser(id);

        res.json(removed);
        myLogger.log(`User with id ${id} was removed from DB`);
        myLogger.save(`User with id ${id} was removed from DB`);
    }

    getAllUsers(req: Request, res: Response){
        const result = this.userService.getAllUsers();
        res.json(result);
        myLogger.log(`All users responded`);
    }

    getUserById(req: Request, res: Response){
        const param = req.query.id as string;

        if(!param || Number.isNaN(parseInt(param))){
            throw new HttpError(400, 'Bad request: wrong params!');
        }

        const user = this.userService.getUserById(parseInt(param));
        res.json(user);
        myLogger.log(`User responded`);
    }

    updateUser(req: Request, res: Response) {
        const body = req.body;

        if (!isUserType(body)) {
            throw new HttpError(400, 'Bad request: invalid user data!');
        }

        this.userService.updateUser(body);

        res.json({
            message: "User was successfully updated",
            user: body
        });
        myLogger.log(`User with id ${body.id} was updated`);
    }
}