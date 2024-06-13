import express from "express";
import userCtrl from '../users/usersCtrl';

const router = express.Router();

router.route('/')
   .get(userCtrl.getList)
   .post(userCtrl.post);

router.route('/:id')
   .get(userCtrl.getItem)
   .put(userCtrl.update)
   .delete(userCtrl.delete);

export default router;