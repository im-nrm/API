import express from "express";
import newsCtrl from "./newsCtrl";
import commentsRouter from "../comments/commentsRoutes";

const newsRouter = express.Router();

newsRouter.route('/')
   .get(newsCtrl.getList)
   .post(newsCtrl.post);

newsRouter.route('/:id')
   .get(newsCtrl.getItem)
   .put(newsCtrl.update)
   .delete(newsCtrl.delete);

newsRouter.use('/:id/comments',commentsRouter)

export default newsRouter;