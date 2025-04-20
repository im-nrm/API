import express from "express";
import changelogCtrl from "./changelogCtrl";

const changelogRouter = express.Router();

changelogRouter.route('/')
   .get(changelogCtrl.getActive)
   .post(changelogCtrl.post);

changelogRouter.route('/all')
   .get(changelogCtrl.getList)

changelogRouter.route('/:id')
   // .get(changelogCtrl.getItem)
   .put(changelogCtrl.update)
   .delete(changelogCtrl.delete);


export default changelogRouter;