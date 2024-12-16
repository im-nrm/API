import express from "express";
import tagsCtrl from "./tagsCtrl";

const tagsRouter = express.Router();

tagsRouter.route('/')
   .get(tagsCtrl.getList)
   .post(tagsCtrl.post);

   tagsRouter.route('/:id')
   // .get(tagsCtrl.getItem)
   .put(tagsCtrl.update)
   .delete(tagsCtrl.delete);


export default tagsRouter;