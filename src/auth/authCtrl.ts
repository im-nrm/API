import { Request, Response } from "express";
import UserModel from "../users/userModel";
import { Encrypt } from "../core/encrypt/encrypt";

class authCtrl{
    constructor(){

    }

    async postLogin(req: Request, res: Response){
        const body = req.body;
        console.log()

        const response = await UserModel.findOne({ 
            username: body.username
        });


        if(!response){
            res.status(404).send({message: 'El usuario no existe'});
        }else{
            if(await Encrypt.comparePassword(body.password, response.password!)){
                res.send(response);
            }else{
                res.status(404).send({message: 'Contraseña invalida'});
            }
        }
    }

    async postRegister (req: Request, res: Response){

    }

}
export default new authCtrl();