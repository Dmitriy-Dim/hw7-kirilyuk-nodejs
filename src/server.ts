import express, {Request, Response, NextFunction} from 'express';
import {apiRouter} from "./routes/appRouter.ts";
import {UserService} from "./services/UserService.ts";
import {UserServiceEmbeddedImpl} from "./services/UserServiceEmbeddedImpl.ts";
import {UserController} from "./controllers/UserController.ts";
import {UserFilePersistenceService} from "./services/UserFilePersistenceService.ts";
import {myLogger} from "./utils/logger.ts";
import {PostServiceEmbeddedImpl} from "./services/PostServiceEmbeddedImpl.ts";
import {HttpError} from "./errorHandler/HttpError.js";

export const service: UserService = new UserServiceEmbeddedImpl();
export const userController = new UserController(service);
export const postService = new PostServiceEmbeddedImpl();

await (service as unknown as UserFilePersistenceService).restoreDataFromFile();

export const launchServer = () => {
    const app = express();

    // ================= Middleware =================
    app.use(express.json());

    // ================= Router =================
    app.use('/api', apiRouter);

    app.use((req: Request, res: Response) => {
        throw new HttpError(404, "Route not found");
    });

    // ================ Глобальная обработка ошибок =================
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        myLogger.log(`Error occurred: ${err.message}`);
        myLogger.save(`Error occurred: ${err.message}`);

        if (err instanceof HttpError) {
            return res.status(err.status).json({
                error: err.message,
                status: err.status
            });
        }

        if (err.message.includes('ValidationError') || err.name === 'ValidationError') {
            return res.status(400).json({
                error: err.message,
                status: 400
            });
        }

        if (err && 'body' in err) {
            return res.status(400).json({
                error: 'Invalid JSON format',
                status: 400
            });
        }

        myLogger.log(`Unknown error: ${err.stack}`);
        myLogger.save(`Unknown error: ${err.stack}`);

        return res.status(500).json({
            error: 'Internal server error',
            status: 500
        });
    });

    app.listen(3005, () => console.log("Server runs at http://localhost:3005"));

    process.on('SIGINT', () => {
        (service as unknown as UserFilePersistenceService).saveDataToFile().then(() => {
            myLogger.log("Data saved");
            myLogger.saveToFile("Server shutdown by Ctrl+C");
            process.exit(0);
        });
    });
};