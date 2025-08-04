import {Post} from "../model/postTypes.js";
import {postService, service} from "../server.ts";
import {Request,Response} from "express";
import {HttpError} from "../errorHandler/HttpError.js";

export function getUserPostsByName(req:Request, res:Response) {
    const users = service.getAllUsers();
    const user = users.find(item => item.userName === req.query.userName);
    if(!user) throw new HttpError(404, `User with name ${req.query.userName} not found`);

    const result = postService.getAllUserPosts(user.id);
    res.json(result);
}

export function getUserPost(req:Request, res:Response) {
    const uId = parseInt(req.params.userId);
    if(!uId || isNaN(uId)) throw new HttpError(400, "Invalid user ID in request");

    res.json(postService.getAllUserPosts(uId));
}

export function updatePost(req:Request, res:Response) {
    const post = req.body;

    service.getUserById(post.userId);

    const result = postService.updatePost(post);
    res.send("Post successfully updated");
}

export function removePost(req:Request, res:Response) {
    const postId = parseInt(req.params.id);
    if(!postId || isNaN(postId)) throw new HttpError(400, "Invalid post ID in request");

    const result = postService.removePost(postId);
    res.json(result);
}

export function getPostById(req:Request, res:Response) {
    const postId = parseInt(req.params.id);
    if(!postId || isNaN(postId)) throw new HttpError(400, "Invalid post ID in request");

    const result = postService.getPost(postId);
    res.json(result);
}

export function getAllPosts() {
    return postService.getAllPosts();
}

export function addPost(req:Request, res:Response) {
    console.log(req.body);
    const post = req.body as Post;

    service.getUserById(post.userId);

    postService.addPost(post);
    res.status(201).send("Post was successfully added");
}