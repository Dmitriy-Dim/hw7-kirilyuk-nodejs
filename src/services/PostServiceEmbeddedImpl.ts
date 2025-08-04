import {PostService} from "./PostService.js";
import {Post} from "../model/postTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class PostServiceEmbeddedImpl implements PostService{
    private posts:Post[] = [];

    addPost(post: Post): boolean {
        const index = this.posts.findIndex(item => item.id === post.id);
        if(index !== -1) {
            throw new HttpError(409, `Post with id ${post.id} already exists`);
        }
        this.posts.push(post);
        console.log([...this.posts]);
        return true;
    }

    getAllUserPosts(userId: number): Post[] {
        return this.posts.filter(item => item.userId === userId);
    }

    getPost(id: number): Post {
        const index = this.posts.findIndex(item => item.id === id);
        if(index === -1){
            throw new HttpError(404, `Post with id ${id} not found`);
        }
        return this.posts[index]
    }

    removePost(id: number): Post {
        const index = this.posts.findIndex(item => item.id === id);
        if(index === -1) throw new HttpError(404, `Post with id ${id} not found`);
        return this.posts.splice(index, 1)[0]
    }

    updatePost(post: Post): boolean {
        const index = this.posts.findIndex(item => item.id === post.id);
        if(index === -1) {
            throw new HttpError(404, `Post with id ${post.id} not found`);
        }
        this.posts[index] = post;
        console.log([...this.posts]);
        return true;
    }

    getAllPosts(): Post[] {
        return [...this.posts];
    }
}