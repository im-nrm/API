import express from "express";
import userCtrl from '../users/usersCtrl';

const usersRouter = express.Router();

usersRouter.route('/')
   .get(userCtrl.getList)
   .post(userCtrl.post);

usersRouter.route('/:id')
   .get(userCtrl.getItem)
   .put(userCtrl.update)
   .delete(userCtrl.delete);

export default usersRouter;