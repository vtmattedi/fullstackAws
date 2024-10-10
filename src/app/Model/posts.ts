import { db_pool } from "./db";

class Post
{
    id: Number;
    title: String;
    content: String;
    user_id: Number;
    created_at: Date;

    constructor(id: Number, title: String, content: String, user_id: Number, created_at: Date)
    {
        this.id = id;
        this.title = title;
        this.content = content;
        this.user_id = user_id;
        this.created_at = created_at;
    }
}

const createPoster = async (title: String, content: String, user_id: Number) => {
    const [result] = await db_pool.query('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, user_id]) as any;
    return (result.insertId);
};

const deletePost = async (id: Number) => {
    return db_pool.query('DELETE FROM posts WHERE id = ?', [id]).then((result) => {
        return true;
    }).catch((err) => {
        console.log(err);
        return false;
    });
}

const getPostsByUserId = async (user_id: Number) => {
    const [posts] = await users_pool.query('SELECT * FROM posts WHERE user_id = ?', [user_id]) as Array<any>;
    return posts;
    
}

export { createPoster, deletePost, getPostsByUserId, Post };