import {UserService} from "../services/UserService.ts";
import {isUserType, parseBody} from "../utils/tools.ts";
import {User} from "../model/userTypes.ts";
import {IncomingMessage, ServerResponse} from "node:http";
import {baseUrl} from "../config/userServerConfig.ts";
import {myLogger} from "../utils/logger.ts";
import {HttpError} from "../errorHandler/HttpError.js";

export class UserController{
    constructor(private userService: UserService) { }

    async addUser(req:IncomingMessage, res:ServerResponse){
        const body = await parseBody(req);
        if(!isUserType(body)){
            throw new HttpError(400, 'Bad request: wrong params!');
        }

        const user = body as User;
        this.userService.addUser(user);

        res.writeHead(201, {'Content-Type': 'text/html'});
        res.end(`Created`);
        myLogger.log(`User with id ${user.id} was added`);
        myLogger.save(`User with id ${user.id} was added`);
    }

    removeUser(req:IncomingMessage, res:ServerResponse) {
        const url = new URL(req.url!, baseUrl);
        const param = url.searchParams.get('id');

        if(!param || Number.isNaN(parseInt(param))){
            throw new HttpError(400, 'Bad request: wrong params!');
        }

        const id = parseInt(param!);
        const removed = this.userService.removeUser(id);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(removed));
        myLogger.log(`User with id ${id} was removed from DB`);
        myLogger.save(`User with id ${id} was removed from DB`);
    }

    getAllUsers(req:IncomingMessage, res:ServerResponse){
        const result = this.userService.getAllUsers();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
        myLogger.log(`All users responsed`);
    }

    getUserById(req:IncomingMessage, res:ServerResponse){
        const url = new URL( req.url!, baseUrl);
        const param = url.searchParams.get('id');

        if(!param || Number.isNaN(parseInt(param))){
            throw new HttpError(400, 'Bad request: wrong params!');
        }

        const user = this.userService.getUserById(parseInt(param!));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
        myLogger.log(`User responsed`);
    }

    async updateUser(req: IncomingMessage, res: ServerResponse) {
        const body = await parseBody(req) as User;
        if (!isUserType(body)) {
            throw new HttpError(400, 'Bad request: invalid user data!');
        }

        this.userService.updateUser(body);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('User was successfully updated');
        myLogger.log(`User with id ${body.id} was updated`);
    }
}