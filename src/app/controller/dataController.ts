import { Request, Response } from 'express';
import { getUserById, getUsers, getUsersByEmail, User, modifyUser, searchUser } from '../Model/user';
import * as Posts from '../Model/posts';
import { url } from 'inspector';

class DataController {
    handleUserById = async (req: Request, res: Response) => {

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

    getUser = async (req: Request, res: Response) => {

        const user_search = req.url.substring(req.url.lastIndexOf('/') + 1);
        if (!user_search || user_search.length < 2) {
            res.status(200).send({ users: [] });
            return;
        }
        const users = await searchUser(user_search) as Array<User>;
        res.status(200).send({
            users: users.map((user) => {
                return { user: user.username, email: user.email, id: user.id, created_at: user.created_at };
            })
        });
    }


}

export const dataController = new DataController();