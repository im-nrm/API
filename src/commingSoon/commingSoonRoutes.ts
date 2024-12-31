import express from "express";
import commingSoonCtrl from "./commingSoonCtrl";

const commingSoonRouter = express.Router();

commingSoonRouter.route('/')
   .get(commingSoonCtrl.getList)
   .post(commingSoonCtrl.post);

   commingSoonRouter.route('/:id')
   // .get(commingSoonCtrl.getItem)
   .put(commingSoonCtrl.update)
   .delete(commingSoonCtrl.delete);


export default commingSoonRouter;