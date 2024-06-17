import express from "express";
import commentsCtrl from "./commentsCtrl";

const commentsRouter = express.Router({mergeParams: true});

commentsRouter.route('/')
   .get(commentsCtrl.getList)
   .post(commentsCtrl.post)

commentsRouter.route('/:commentId')
    .put(commentsCtrl.update)
    .delete(commentsCtrl.delete)

commentsRouter.route('/:commentId/feedback')
    .post(commentsCtrl.postFeedback)

export default commentsRouter;