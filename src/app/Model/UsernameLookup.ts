import { db_pool } from './db';

export class UsernameLookup {
    static usernameMap = new Map<Number, String>();

    static async loadUsernames() {
        try {
            const [users] = await db_pool.query('SELECT * FROM users') as Array<any>;
            for (const user of users) {
                UsernameLookup.addUsername(user.id, user.username);
            }
            console.log("Loaded usernames from database");
        }
        catch (err) {
            console.log("Error Loading usernames from database");
        }
    }

    static addUsername(uid: Number, username: String) {
        UsernameLookup.usernameMap.set(uid, username);
    }
    static deleteUsername(uid: Number) {
        UsernameLookup.usernameMap.delete(uid);

    }

    static getUsername(uid: Number) {
        if (!UsernameLookup.usernameMap.has(uid)) {
            return "User deleted";
        }
        return UsernameLookup.usernameMap.get(uid);

    }
    static editUsername(uid: Number, username: String) {
        UsernameLookup.usernameMap.set(uid, username);
    }
}