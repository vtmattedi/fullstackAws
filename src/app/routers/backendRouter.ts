import { Router } from "express";
import authMiddleware from "../controller/authMiddleware";
import {dataController} from "../controller/dataController";
const dataRouter: Router = Router()

//Routes
dataRouter.get("/dashboard", authMiddleware, dataController.handleUserById);
dataRouter.get("/others", authMiddleware, dataController.handleGetOthers)
dataRouter.post("/edituser", authMiddleware, dataController.handleEditUser)
dataRouter.post("/newpost", authMiddleware, dataController.handleCreatePost)
export { dataRouter };

