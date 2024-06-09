import express from "express";
import usersController from '../controllers/usersCtrl';

const router = express.Router();

router.route('/')
   .get(usersController.getList)
   .post(usersController.post);

router.route('/:id')
   .get(usersController.getItem)
   .put(usersController.update)
   .delete(usersController.delete);

export default router;