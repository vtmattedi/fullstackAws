import { configDotenv } from "dotenv";

const assertDotEnv = () => {
    const dotenv = configDotenv();
    if ( process.env.JWT_REFRESH_SECRET)
    {
        return true;
    }
    if (!dotenv.parsed?.JWT_SECRET) {
        return false;
    }
    else if (!dotenv.parsed?.JWT_REFRESH_SECRET) {
        return false;
    }
    else if (!dotenv.parsed?.DB_PASSWORD) {
        return false;
    }
    else if (!dotenv.parsed?.SCRYPT_SALT) {
        return false;
    }
    else if (!dotenv.parsed?.FRONTEND_PORT) {
        return false;
    }
    else if (!dotenv.parsed?.AUTH_PORT) {
        return false;
    }
    else if (!dotenv.parsed?.BACKEND_PORT) {
        return false;
    }
    return true;
};

interface IResult {
    result: boolean;
    message: string;
}

class Asserter {
    public static email = (email: string) => {
        let result: IResult = { result: false, message: "" };
        if (!email)
            return { result: false, message: "Email is required." };

        let errors = "";
        if (email.length > 255) {
            errors += "Email is too long. ";
        }
        // check for name@domain.com
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors += "Email must be in the format name@domain.com. ";
        }
        // check for .;:/\@, characters
        else if (!/^[^,;:/\\@]+@[^,;:/\\@]+\.[^,;:/\\@]+$/.test(email)) {
            errors += "Email must not contain special characters. ";
        }
        else if (email.length < 5) {
            errors += "Email is too short. ";
        }
        else { result.result = true; }
        result.message = errors;
        return result;
    }
    public static password = (password: string) => {
        let result: IResult = { result: false, message: "" };
        if (!password)
            return { result: false, message: "Password is required." };

        let errors = "";
        if (password.length > 255) {
            errors += "Password is too long. ";
        }
        else if (password.length < 8) {
            errors += "Password is too short. must be at least 8 characters. ";
        }
        else { result.result = true; }

        result.message = errors;

        return result;
    }

    public static username = (username: string) => {
        let result: IResult = { result: false, message: "" };
        if (!username)
            return { result: false, message: "Username is required." };
        let errors = "";
        if (username.length > 255) {
            errors += "Username is too long. ";
        }
        else if (username.length < 5) {
            errors += "Username is too short. must be at least 5 characters. ";
        }
        else if (!/^[^\W\s]+$/.test(username)) {
            errors += "Username must not contain special characters. ";
        }
        else if (username.toLowerCase().includes("admin")) {
            errors += "Username must not contain the word admin. ";
        }
        else if (username.toLowerCase().includes("root")) {
            errors += "Username must not contain the word root. ";
        }
        else if (username.toLowerCase().includes("superuser")) {
            errors += "Username must not contain the word superuser. ";
        }
        else { result.result = true; }

        result.message = errors;
        return result;
    }
}

export { assertDotEnv, Asserter, IResult };
