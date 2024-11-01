import { sql } from './db';

export class UsernameLookup {
    /**
    * A map to store usernames with their corresponding user IDs.
    */
    static usernameMap = new Map<number, String>();
    /**
    * Loads usernames from the database and populates the usernameMap.
    * 
    * @async
    * @returns {Promise<void>} A promise that resolves when the usernames are loaded.
    */
    static async loadUsernames() {
        try {
            const users = await sql('SELECT * FROM users') as Array<any>;
            for (const user of users) {
                UsernameLookup.addUsername(user.id, user.username);
            }
            UsernameLookup.#setMaxId();
            console.log("Loaded usernames from database");
        }
        catch (err) {
            console.log("Error Loading usernames from database");
        }
    }

    /**
    * Adds a username to the usernameMap.
    * 
    * @param {number} uid - The user ID.
    * @param {String} username - The username.
    */
    static addUsername(uid: number, username: String) {
        UsernameLookup.usernameMap.set(uid, username);
        if (uid > UsernameLookup.MAXID) {
            UsernameLookup.MAXID = uid;
        }
    }
    
    /**
     * Deletes a username from the usernameMap.
     * 
     * @param {number} uid - The user ID.
     */
    static deleteUsername(uid: number) {
        UsernameLookup.usernameMap.delete(uid);
    UsernameLookup.#setMaxId();
    }

    /**
    * Retrieves a username from the usernameMap.
    * 
    * @param {number} uid - The user ID.
    * @returns {String | undefined} The username or "User deleted" if the user ID does not exist.
    */
    static getUsername(uid: number) {
        if (!UsernameLookup.usernameMap.has(uid)) {
            return "User deleted";
        }
        return UsernameLookup.usernameMap.get(uid);

    }

    /**
     * Edits a username in the usernameMap.
     * 
     * @param {number} uid - The user ID.
     * @param {String} username - The new username.
     */
    static editUsername(uid: number, username: String) {
        UsernameLookup.usernameMap.set(uid, username);
    }

    
    /**
     * A private static method that sets the maximum ID (`MAXID`) in the `UsernameLookup` class.
     * It iterates through the keys of the `usernameMap` and updates `MAXID` to the highest key value found.
     * This method is used to ensure that `MAXID` always holds the highest key value present in the map.
     */
    static #setMaxId(){
        UsernameLookup.MAXID = 0;
        for (let key of UsernameLookup.usernameMap.keys()) {
            if (key > UsernameLookup.MAXID) {
                UsernameLookup.MAXID = key;
            }
        }
    }

    // Static variable to store the maximum ID of the users table (For auto-incrementing user IDs in Postgress)
    static MAXID: number = 0;
}