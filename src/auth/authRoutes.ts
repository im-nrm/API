import express from "express";
import authCtrl from "./authCtrl";

const authRouter = express.Router();

authRouter.route('/login')
   .post(authCtrl.postLogin);

authRouter.route('/logout')
   .post(authCtrl.postLogout);

authRouter.route('/register')
   .post(authCtrl.postRegister); //TODO: register

authRouter.route('/get_user_with_cookie_test').get(authCtrl.get_user_with_cookie_test) //TODO: cambiar

export default authRouter;