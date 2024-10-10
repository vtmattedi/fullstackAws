import { Router } from "express";
import authMiddleware from "../controller/authMiddleware";
import {dataController} from "../controller/dataController";
const dataRouter: Router = Router()

//Routes
dataRouter.get("/", (req, res) => {
    res.send("Hello World..be");
});
dataRouter.get("/dashboard", authMiddleware, dataController.handleUserById);
dataRouter.get("/others", authMiddleware, dataController.handleGetOthers)
export { dataRouter };

