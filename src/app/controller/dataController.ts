import { Request, Response } from 'express';
import { getUserById, getUsers, getUsersByEmail, User, modifyUser } from '../Model/user';
import { create } from 'domain';
import * as Posts from '../Model/posts';

class DataController {
    handleUserById = async (req: Request, res: Response) => {
        console.log(req.body);
        const userId = req.body.uid;
        const user = (await getUserById(userId));
        if (!user.found) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        else
            res.status(200).send({ user: user.user.username, email: user.user.email, id: user.user.id, created_at: user.user.created_at });
    };

    handleGetOthers = async (req: Request, res: Response) => {

        const users = await getUsers() as Array<User>;
        const others = users.filter((user) => user.id !== req.body.uid);
        const otherUsers = others.map((user) => {
            return { user: user.username, email: user.email, id: user.id, created_at: user.created_at };
        });
        res.status(200).send({ users: otherUsers });
    }

    handleEditUser = async (req: Request, res: Response) => {
        const userId = req.body.uid;
        const user = (await getUserById(userId));
        if (!user.found) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        const { username, email } = req.body;
        if (!username && !email) {
            res.status(400).send({ message: 'Username or email are required' });
            return;
        }
        if (email) {
            const find_res = await getUsersByEmail(email);
            if (find_res.found && find_res.user[0].id !== userId) {
                res.status(400).send({ message: 'Email already registered' });
                return;
            }
        }
        const result = await modifyUser(userId, username || user.user.username, email || user.user.email);
        if (result) {
            res.status(200).send({ message: 'User updated' });
        }
        else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
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
        const postId = await Posts.createPoster(title, content, userId);
        if (!postId) {
            res.status(500).send({ message: 'Internal Server Error' });
            return;
        }
        res.status(200).send({ message: 'Post created', id: postId });

    }
}

export const dataController = new DataController();