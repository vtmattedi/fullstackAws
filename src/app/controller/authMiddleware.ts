import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { assertDotEnv } from '../Asserter';

const authMiddleware = (req: Request, res: Response, next?: NextFunction) => {
    const token = req.header('authorization')?.replace('Bearer ', '');
    if (!assertDotEnv())
    {
        res.status(500).send({ error: 'Internal Server Error 065' });
        return;
    }
    
    if (!token) {
         res.status(401).send({ error: 'Access denied. No token provided.' });
        return;
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                res.status(401).send({ error: 'Invalid token.' });
                return;
            }
            const {uid} = decoded;
            req.body.uid = uid;
            if (next)
                next();
        }
        );
       
    } catch (err) {
        console.log("error on AuthMiddleWare:", err);
        res.status(500).send({ error: 'Something went wrong' });
    }
};

export default authMiddleware;