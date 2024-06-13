import express from "express";
import registerCtrl from "./registerCtrl";

const router = express.Router();

router.route('/')
   .post(registerCtrl.post);


export default router;