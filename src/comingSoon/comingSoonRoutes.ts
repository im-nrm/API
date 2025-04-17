import express from "express";
import comingSoonCtrl from "./comingSoonCtrl";

const comingSoonRouter = express.Router();

comingSoonRouter.route('/')
   .get(comingSoonCtrl.getList)
   .post(comingSoonCtrl.post);

comingSoonRouter.route('/:id')
   // .get(comingSoonCtrl.getItem)
   .put(comingSoonCtrl.update)
   .delete(comingSoonCtrl.delete);


export default comingSoonRouter;