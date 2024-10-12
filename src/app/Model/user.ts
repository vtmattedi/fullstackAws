import { db_pool } from './db';

class User {
    id: Number;
    username: String;
    password: String;
    email: String;
    created_at: Date;

    constructor(id: Number, username: String, password: String, email: String, created_at: Date) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.created_at = created_at;
    }
}

const getUsers =  async () => {
    const [users] = await db_pool.query('SELECT * FROM users') as Array<any>;
    return users;
}

const searchUser = async (username: String) => {
    const searchTerm = `${username}`;
    const [user] = await db_pool.query("SELECT * FROM users WHERE username LIKE CONCAT('%', ?, '%')", [searchTerm]) as Array<any>;
    return user;
}

const createUser = async (username: String, password: String, email:String) => {
    const [result] = await db_pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]) as any;
    return (result.insertId);
}

const getUsersByEmail = async (email: String) => {
    const [user] = await db_pool.query('SELECT * FROM users WHERE email = ?', [email]) as Array<any>;
    return {found: user.length > 0, user: user};
}

const getUserById = async (id: Number) => {
    const [user] = await db_pool.query('SELECT * FROM users WHERE id = ?', [id]) as Array<any>;
    return {found: user.length > 0, user: user[0]}; 
    
}

const modifyUser = async (id: Number, username: String, email: String) => {
    const [result] = await db_pool.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]) as any;
    return result.affectedRows > 0;
}



export { getUsers, createUser, getUsersByEmail, getUserById, User, modifyUser,searchUser };