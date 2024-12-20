import { sql } from './db';
/*Model Resposible for Creating, Checking if is a RefreshToken is Valid and Deleting RefreshTokens*/

// Create a token
const createToken = async (token: String, user_id: Number) => {
   try {
       const res = await sql('INSERT INTO refreshTokens (token, user_id) VALUES ($1, $2) RETURNING *', [token, user_id]);
       return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

// Delete a token
const deleteToken = async (token: String) => {
    return sql('DELETE FROM refreshTokens WHERE token = $1 RETURNING *', [token]).then(() => {
        return true;
    }).catch(() => {
        console.log();
      return false;
    }
    );
}

// Delete all tokens for a user
const deleteTokenByUserId = async (user_id: Number) => {
    
    try {
        const res = await sql('DELETE FROM refreshTokens WHERE user_id = $1 RETURNING *', [user_id]) as Array<any>;
        return res.length;
    } catch (error) {
        console.log(error);
        return 0;
    }

}

//Check if a token is valid (exists in the database)
const isTokenValid = async (token: String) => {
  try {
    const res = await sql('SELECT * FROM refreshTokens WHERE token = $1', [token]) as Array<any>;
      return res.length > 0;
  } catch (error) {
        console.log(error);
        return false;
    }
}

export { createToken, deleteToken, isTokenValid, deleteTokenByUserId };