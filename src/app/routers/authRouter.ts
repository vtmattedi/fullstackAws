import { Router } from "express";
import {authController} from "../controller/authController";
import authMiddleware from "../controller/authMiddleware";
const authRouter: Router = Router()

//Routes
authRouter.get("/", (req, res) => {
    res.send("Hello World");
});
authRouter.post("/signup", authController.signUp);
authRouter.post("/login", authController.login);
authRouter.delete("/logout", authController.logout);
authRouter.delete("/logoutEveryone", authController.logout)
authRouter.post("/token", authController.refreshToken);
export { authRouter };

