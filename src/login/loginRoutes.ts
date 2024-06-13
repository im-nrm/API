import express from "express";
import loginCtrl from "./loginCtrl";

const router = express.Router();

router.route('/')
   .post(loginCtrl.post);


export default router;