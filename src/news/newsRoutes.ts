import express from "express";
import newsCtrl from "./newsCtrl";
import commentsRouter from "../comments/commentsRoutes";
import { uploadMiddleware } from "../core/upload_config/upload_config";

const newsRouter = express.Router();

newsRouter.route('/')
   .get(newsCtrl.getList)
   .post(newsCtrl.post);

newsRouter.route('/bookmark')
   .post(newsCtrl.getBookmarks); //TODO: en un futuro puede ser mas que noticias

newsRouter.route('/me')
   .get(newsCtrl.getNewsByUser);

newsRouter.route('/:id')
   .get(newsCtrl.getItem)
   .put(newsCtrl.update)
   .delete(newsCtrl.delete);

newsRouter.route('/:id/image')
   .post(uploadMiddleware, newsCtrl.uploadImage);
   

newsRouter.route('/:id/feedback')
   .post(newsCtrl.feedback)


newsRouter.use('/:id/comments',commentsRouter)

export default newsRouter;