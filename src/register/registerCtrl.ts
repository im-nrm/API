import { Request, Response } from "express";
import ModelUser from "../users/usersModel";
import { Encrypt } from "../core/encrypt/encrypt";

class RegisterCtrl{
    constructor(){

    }

    async post(req: Request, res: Response){
        res.send(req.body)
        
    }

}
export default new RegisterCtrl();