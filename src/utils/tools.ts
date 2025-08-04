import {Post} from "../model/postTypes.ts";

export const sayHi = (name: string): void => {
    console.log(`Hello ${name}`);
}

export const isUserType = (obj: any): boolean => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'number' &&
        typeof obj.userName === 'string' &&
        obj.userName.trim().length > 0
    );
}

export function convertPostDto(postDto: unknown): Post | null {
    console.log("Converting postDto:", postDto);

    if (!postDto || typeof postDto !== 'object') {
        console.log("Invalid postDto: not an object");
        return null;
    }

    const post = postDto as any;

    if (!post.id || !post.userId) {
        console.log("Missing required fields:", { id: post.id, userId: post.userId });
        return null;
    }

    const convertedPost: Post = {
        id: Number(post.id),
        userId: Number(post.userId),
        title: post.title || "No title",
        text: post.text || "Some text"
    };

    if (isNaN(convertedPost.id) || isNaN(convertedPost.userId)) {
        console.log("Invalid number fields:", { id: convertedPost.id, userId: convertedPost.userId });
        return null;
    }

    console.log("Converted post:", convertedPost);
    return convertedPost;
}