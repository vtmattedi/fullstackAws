import { db_pool } from './db';

const createToken = async (token: String, user_id: Number) => {
   try {
       const res = await db_pool.query('INSERT INTO refreshTokens (token, user_id) VALUES (?, ?)', [token, user_id]);
       return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}


const deleteToken = async (token: String) => {
    return db_pool.query('DELETE FROM refreshTokens WHERE token = ?', [token]).then((result) => {
        return true;
    }).catch((err) => {
        console.log(err);
      return false;
    }
    );
}

const deleteTokenByUserId = async (user_id: Number) => {
    
    try {
        const [res] = await db_pool.query('DELETE FROM refreshTokens WHERE user_id = ?', [user_id]) as Array<any>;
        return res.affectedRows;
    } catch (error) {
        console.log(error);
        return 0;
    }

}

const isTokenValid = async (token: String) => {
  try {
      const [res] = await db_pool.query('SELECT * FROM refreshTokens ', [token]) as Array<any>;
      return res.length > 0;
  } catch (error) {
        console.log(error);
        return false;
    }
}

export { createToken, deleteToken, isTokenValid, deleteTokenByUserId };