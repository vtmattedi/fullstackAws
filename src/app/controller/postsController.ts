import { Request, Response } from 'express';
import { getUserById } from '../Model/user';
import * as Posts from '../Model/posts';
import { parse } from 'path';

interface deletedPost {
    id: Number,
    when: Date
}
const deletedPostsId: Array<deletedPost> = []
class PostController {
    handleEditPost = async (req: Request, res: Response) => {
        const { uid } = req.body;
        const { postId, title, content } = req.body;
        console.log('edit post:', postId, title, content);
        if (!postId || postId < 0) {
            res.status(400).send({ message: 'Post id is required' });
            return;
        }

        const post = await Posts.getPostById(parseInt(postId as string));
        if (!post.found) {
            res.status(404).send({ message: 'Post not found' });
            return;
        }

        if (post.post?.user_id !== uid) {
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        if (!title || !content) {
            res.status(400).send({ message: 'Title and content are required' });
            return;
        }
        const updated = await Posts.editpost(parseInt(postId as string), title, content);
        if (!updated) {
            res.status(500).send({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).send({ message: 'Post updated' });
    
    }

    handleCreatePost = async (req: Request, res: Response) => {
        const userId = req.body.uid;
        const user = (await getUserById(userId));
        if (!user.found) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        const { title, content } = req.body;
        if (!title || !content) {
            res.status(400).send({ message: 'Title and content are required' });
            return;
        }
        const postId = await Posts.createPost(title, content, userId);
        if (!postId) {
            res.status(500).send({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).send({ message: 'Post created', id: postId });

    }

    handleDeletePost = async (req: Request, res: Response) => {
        const { uid } = req.body;
        const {postId} = req.query;
        if (!postId) {
            res.status(400).send({ message: 'Post id is required' });
            return;
        }

        const post = await Posts.getPostById(parseInt(postId as string));
        if (!post.found) {
            res.status(404).send({ message: 'Post not found' });
            return;
        }

        if (post.post?.user_id !== uid) {
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        console.log('deleting post:', postId);
        const deleted = await Posts.deletePostById(parseInt(postId as string));

        if (!deleted) {
            res.status(500).send({ message: 'Internal Server Error' });
            return;
        }
        deletedPostsId.push({ id: parseInt(postId as string), when: new Date() });
        console.log('adding post delete:', deletedPostsId.length);
        res.status(200).send({ message: 'Post deleted' });
    }

    getPostsByUserId = async (req: Request, res: Response) => {
        const { uid } = req.body;
        let targetid = parseInt(req.params.id);
        const path = req.url;

        const num = parseInt(path.substring(1));
        if (!isNaN(num)) {
            targetid = num;
        }
        ;
        if (targetid) {
            const posts = await Posts.getPostsByUserId(targetid);
            res.status(200).send({ posts });
            return;
        }
        const posts = await Posts.getPostsByUserId(uid);
        res.status(200).send({ posts });
    }

    getAllPosts = async (req: Request, res: Response) => {
        const { size } = req.query;
        if (size) {
            const posts = await Posts.getAllPosts(parseInt(size as string));
            res.status(200).send({ posts });
            return;
        }
        const posts = await Posts.getAllPosts();
        res.status(200).send({ posts });
    }

    getNewPosts = async (req: Request, res: Response) => {
        const { targetId, lastId } = req.query;
        if (targetId && lastId) {
            const posts = await Posts.getNewPostsByUserId(parseInt(targetId as string), parseInt(lastId as string));
            res.status(200).send({ posts: posts, deleted: deletedPostsId.map((post) => post.id) }); 
        }
        else if (lastId) {
            const posts = await Posts.getNewPosts(parseInt(lastId as string));
            res.status(200).send({ posts: posts, deleted: deletedPostsId.map((post) => post.id) });
        }
        else {
            res.status(400).send({ message: 'Invalid request' });
        }
    }
}

export const postController = new PostController();