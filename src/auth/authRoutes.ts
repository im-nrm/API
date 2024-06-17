import express from "express";
import authCtrl from "./authCtrl";

const authRouter = express.Router();

authRouter.route('/login')
   .post(authCtrl.postLogin);

authRouter.route('/register')
   .post(authCtrl.postRegister); //TODO: register


export default authRouter;