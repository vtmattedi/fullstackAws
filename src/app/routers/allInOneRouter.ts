import { Router } from "express";
import {authController} from "../controller/authController";
import {dataController} from "../controller/dataController";
import authMiddleware from "../controller/authMiddleware";
const allRouter: Router = Router()

//Routes
allRouter.post("/auth/signup", authController.signUp);
allRouter.post("/auth/login", authController.login);
allRouter.delete("/auth/logout", authController.logout);
allRouter.delete("/auth/logoutEveryone", authController.logout)
allRouter.post("/auth/token", authController.refreshToken);
allRouter.get("/api/dashboard", authMiddleware, dataController.handleUserById);
allRouter.get("/api/others", authMiddleware, dataController.handleGetOthers)

export { allRouter };

