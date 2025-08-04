import {IncomingMessage} from "node:http";
import {Post} from "../model/postTypes.ts";
import {HttpError} from "../errorHandler/HttpError.js";

export const sayHi = (name: string): void => {
    console.log(`Hello ${name}`);
}

export async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (!body.trim()) {
                reject(new HttpError(400, 'Request body is empty'));
                return;
            }
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new HttpError(400, 'Invalid JSON format'));
            }
        });
    });
}

export const isUserType = (obj: any): boolean => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.userName === 'string'
    );
}

export function convertPostDto(postDto: unknown) {
    const post = postDto as Post;
    if (!post.id || !post.userId) {
        return null;
    }
    if (!post.text) post.text = "Some text";
    if (!post.title) post.title = "No title";
    return post;
}