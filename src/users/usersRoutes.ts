import express from "express";
import userCtrl from '../users/usersCtrl';
import { uploadMiddleware } from "../core/upload_config/upload_config";

const usersRouter = express.Router();

usersRouter.route('/')
   .get(userCtrl.getList)
   // .post(userCtrl.post); //XXX: no se usa ??
usersRouter.route('/:id')
   .get(userCtrl.getItem)
   // .put(userCtrl.update) //XXX: no se usa ??
   .delete(userCtrl.delete);
usersRouter.route('/profileImage')
   .post(uploadMiddleware, userCtrl.uploadProfileImage)

export default usersRouter;