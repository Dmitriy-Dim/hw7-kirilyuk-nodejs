import express, {Request, Response, NextFunction} from "express";
import * as controller from '../controllers/postController.js'
import {Post} from "../model/postTypes.js";
import {convertPostDto} from "../utils/tools.ts";
import {myLogger} from "../utils/logger.ts";
import asyncHandler from "express-async-handler";
import {PostDtoSchema} from "../joiSchemas/postShemas.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {validateUserIdParam, validatePostId, validateUserName} from "../validation/userValidation.js";
import {handleValidationErrors} from "../validation/validationMiddleware.js";

export const postRouter = express.Router();

postRouter.use((req:Request, res:Response, next:NextFunction) => {
    myLogger.log(`Request "api/posts${req.url}" was received`);
    next();
});

postRouter.use((req:Request, res:Response, next:NextFunction) => {
    myLogger.save(`Request "api/posts${req.url}" was received`);
    next();
});

// GET /api/posts/user/:userId - получить посты пользователя по ID
postRouter.get('/user/:userId',
    validateUserIdParam,
    handleValidationErrors,
    asyncHandler((req:Request, res:Response) => {
        controller.getUserPost(req, res);
    })
);

// DELETE /api/posts/post/:id - удалить пост по ID
postRouter.delete('/post/:id',
    validatePostId,
    handleValidationErrors,
    asyncHandler((req:Request, res:Response) => {
        controller.removePost(req, res);
    })
);

// PUT /api/posts - обновить пост
postRouter.put('/',
    asyncHandler(async (req:Request, res:Response) => {
        const postDto = req.body;
        const {error} = PostDtoSchema.validate(postDto);
        if(error) throw new HttpError(400, error.message);

        const post: Post | null = convertPostDto(postDto);
        if(!post) throw new HttpError(400, 'Invalid post data');

        req.body = post as Post;
        controller.updatePost(req, res);
    })
);

// POST /api/posts - создать новый пост
postRouter.post('/',
    asyncHandler(async(req:Request, res:Response) => {
        const postDto = req.body;
        const {error} = PostDtoSchema.validate(postDto);
        if(error) throw new HttpError(400, error.message);

        const post: Post | null = convertPostDto(postDto);
        if (!post) throw new HttpError(400, 'Invalid post data');

        req.body = post as Post;
        controller.addPost(req, res);
    })
);

// GET /api/posts - получить все посты
postRouter.get('/',
    asyncHandler((req:Request, res:Response) => {
        const result: Post[] = controller.getAllPosts();
        res.type("application/json").send(JSON.stringify(result));
    })
);

// GET /api/posts/post/:id - получить пост по ID
postRouter.get('/post/:id',
    validatePostId,
    handleValidationErrors,
    asyncHandler((req:Request, res:Response) => {
        controller.getPostById(req, res);
    })
);

// GET /api/posts/user?userName=xxx - получить посты пользователя по имени
postRouter.get('/user',
    validateUserName,
    handleValidationErrors,
    asyncHandler((req:Request, res:Response) => {
        controller.getUserPostsByName(req, res);
    })
);