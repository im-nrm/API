import { Request, Response } from "express";
import ModelUser from "../users/usersModel";
import { Encrypt } from "../core/encrypt/encrypt";

class loginCtrl{
    constructor(){

    }

    async post(req: Request, res: Response){
        //TODO: revisar que este correcto :D
        const body = req.body;
        // const response = await ModelUser.findOne({ 
        //     $and : [{username: body.username},{password: body.password}]
        // })

        const response = await ModelUser.findOne({ 
            username: body.username
        })
        if(!response){
            res.status(404).send({message: 'El usuario no existe'})
        }else{
            
            // res.send(response);
            // TODO: comparar con las pass encryptadas
            if(await Encrypt.comparePassword(body.password, response.password!)){
                res.send(response);
            }else{
                res.status(404).send({message: 'Contraseña invalida'});
            }

            
        }
        
    }

}
export default new loginCtrl();