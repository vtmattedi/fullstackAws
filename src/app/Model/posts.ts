import { db_pool } from "./db";

class Post {
    id: Number;
    title: String;
    content: String;
    user_id: Number;
    created_at: Date;

    constructor(id: Number, title: String, content: String, user_id: Number, created_at: Date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.user_id = user_id;
        this.created_at = created_at;
    }
}

const createPost = async (title: String, content: String, user_id: Number) => {
    const [result] = await db_pool.query('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, user_id]) as any;
    return (result.insertId);
};

const deletePostById = async (id: Number) => {
    try {
        const [res] = await db_pool.query('DELETE FROM posts WHERE id = ?', [id]) as Array<any>;
        {
            console.log("RES: ");
            console.log(res);
            if (res.length === 0) {
                return false;
            }
            else return true;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

const getPostsByUserId = async (user_id: Number) => {
    const [posts] = await db_pool.query('SELECT * FROM posts WHERE user_id = ?', [user_id]) as Array<any>;
    return posts;

}

const getPostById = async (id: Number) => {
    try {
        const [post] = await db_pool.query('SELECT * FROM posts WHERE id = ?', [id]) as Array<any>;
        return { found: post.length > 0, post: post[0] };
    }
    catch (err) {
        console.log(err);
        return { found: false, post: null };
    }
}

const getAllPosts = async () => {
    {
        const [posts] = await db_pool.query('SELECT * FROM posts') as Array<any>;
        return posts;
    }
}

export { createPost, deletePostById, getPostsByUserId, Post, getPostById, getAllPosts };