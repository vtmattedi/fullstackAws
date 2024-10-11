import { Request, Response } from 'express';
import { getUserById } from '../Model/user';
import * as Posts from '../Model/posts';

class PostController {
    
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
        const {postId, uid} = req.body;
        if (!postId) {
            res.status(400).send({ message: 'Post id is required' });
            return;
        }

        const post = await Posts.getPostById(postId);
        if (!post.found) {
            res.status(404).send({ message: 'Post not found' });
            return;
        }

        if (post.post.user_id !== uid) {
            console.log('post.post.user_id:', post.post.user_id, uid);
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        console.log('deleting post:', postId);
        const deleted = await Posts.deletePostById(postId);

        if (!deleted) {
            res.status(500).send({ message: 'Internal Server Error' });
            return;
        }


        res.status(200).send({ message: 'Post deleted' });
    }

    getPostsByUserId = async (req: Request, res: Response) => {
        const {uid} = req.body;
        let targetid = parseInt(req.params.id);
        const path = req.url;
        console.log('path:', path);
        const num = parseInt(path.substring(1));
        if (!isNaN(num)) {
            targetid = num;
        }
        
        console.log('num', parseInt(path.substring(1)));  
        console.log('uid:', req.params);
        console.log('targetid:', targetid, req.body);
        if (targetid)
        {
            const posts = await Posts.getPostsByUserId(targetid);
            res.status(200).send({ posts });
            return;
        }
        const posts = await Posts.getPostsByUserId(uid);
        res.status(200).send({ posts });
    }

    getAllPosts = async (req: Request, res: Response) => {
        const posts = await Posts.getAllPosts();
        res.status(200).send({ posts });
    }
}

export const postController = new PostController();