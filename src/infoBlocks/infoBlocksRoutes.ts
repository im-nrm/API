import { info } from "console";
import express from "express";
import infoBlocksCtrl from "./infoBlocksCtrl";

const infoBlocksRouter = express.Router();

infoBlocksRouter.route('/')
   .get(infoBlocksCtrl.getActive)
   .post(infoBlocksCtrl.post);

infoBlocksRouter.route('/all')
   .get(infoBlocksCtrl.getList)

infoBlocksRouter.route('/:id')
   .put(infoBlocksCtrl.update)
   .delete(infoBlocksCtrl.delete)

export default infoBlocksRouter;