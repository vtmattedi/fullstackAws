import { Router } from "express";
import {authController} from "../controller/authController";
import {dataController} from "../controller/dataController";
import {postController} from "../controller/postsController";
import authMiddleware from "../controller/authMiddleware";
const allRouter: Router = Router()

//Routes
allRouter.post("/auth/signup", authController.signUp);
allRouter.post("/auth/login", authController.login);
allRouter.delete("/auth/logout", authController.logout);
allRouter.delete("/auth/logoutEveryone", authController.logout)
allRouter.post("/auth/token", authController.refreshToken);
allRouter.get("/api/dashboard", authMiddleware, dataController.handleUserById);
allRouter.get("/api/others", authMiddleware, dataController.handleGetOthers);
allRouter.post("/api/update", authMiddleware, dataController.handleEditUser);
allRouter.post("/api/newpost", authMiddleware, postController.handleCreatePost);
allRouter.delete("/api/deletepost", authMiddleware, postController.handleDeletePost);
allRouter.use("/api/posts",authMiddleware, postController.getPostsByUserId);
allRouter.use("/api/post/:id",authMiddleware, postController.getPostsByUserId);
allRouter.use("/api/allposts",authMiddleware, postController.getAllPosts);

export { allRouter };

