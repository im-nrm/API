import express from "express";
import authCtrl from "./authCtrl";

const authRouter = express.Router();

authRouter.route('/login')
   .post(authCtrl.postLogin);

authRouter.route('/logout')
   .post(authCtrl.postLogout);

authRouter.route('/register')
   .post(authCtrl.postRegister);
   
authRouter.route('/resend-validation')
.post(authCtrl.resendValidation);

authRouter.route('/auth/verify/:token')
   .get(authCtrl.verifyAccount);

authRouter.route('/get_user_with_cookie_test').get(authCtrl.get_user_with_cookie_test) //TODO: cambiar

authRouter.route('/test_mail')
   .post(authCtrl.test_mail) //TODO: cambiar

authRouter.route('/auth/me')
   .get(authCtrl.auth_cookie);

export default authRouter;