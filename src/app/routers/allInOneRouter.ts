/*Routes every service provided by the server */

import { Router } from "express";
import {authController} from "../Controller/authController"; //Controller for auth requests
import {dataController} from "../Controller/dataController"; //Controller for data requests
import {postController} from "../Controller/postsController"; ////Controller for post requests
import authMiddleware from "../Controller/authMiddleware"; //Middleware for autthetication

/* 'All in one' Router, may need to be splitted when scaling*/
const allRouter: Router = Router()

/*Authentication routes*/
allRouter.post("/auth/signup", authController.signUp);
allRouter.post("/auth/login", authController.login);
allRouter.delete("/auth/logout", authController.logout);
allRouter.delete("/auth/logoutEveryone", authController.logoutFromAll)
allRouter.delete("/auth/deleteaccount", authController.deleteAccount);
allRouter.post("/auth/token", authController.refreshToken);

/*Api Requests*/
allRouter.get("/api/newposts",authMiddleware, postController.getNewPosts);
allRouter.post("/api/newpost", authMiddleware, postController.handleCreatePost);
allRouter.put("/api/editpost", authMiddleware, postController.handleEditPost);
allRouter.delete("/api/deletepost", authMiddleware, postController.handleDeletePost);
allRouter.use("/api/posts",authMiddleware, postController.getPostsByUserId);
allRouter.use("/api/post/:id",authMiddleware, postController.getPostsByUserId);
allRouter.use("/api/allposts",authMiddleware, postController.getAllPosts);

/*User Requests*/
allRouter.get("/api/dashboard", authMiddleware, dataController.handleUserById);
allRouter.post("/api/edituser", authMiddleware, dataController.handleEditUser);
allRouter.get("/api/finduser/:id",authMiddleware, dataController.getUser)
allRouter.get("/api/finduser",authMiddleware, dataController.getUser);
allRouter.get("/api/userinfo/:id",authMiddleware, dataController.handleUserInfoById)

/* Health check*/
allRouter.use("/api/healtz", (req, res) => {
    res.status(200).send("OK");
});


export { allRouter };

