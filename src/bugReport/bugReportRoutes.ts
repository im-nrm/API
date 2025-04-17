import express from "express";
import bugReportCtrl from "./bugReportCtrl";

const bugReportRouter = express.Router();

bugReportRouter.route('/')
   .get(bugReportCtrl.getList)
   .post(bugReportCtrl.post);

   bugReportRouter.route('/:id')
   // .get(comingSoonCtrl.getItem)
   .put(bugReportCtrl.update)
   .delete(bugReportCtrl.delete);


export default bugReportRouter;