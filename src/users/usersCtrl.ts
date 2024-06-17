import { Request, Response } from "express";
import ModelUser from "../users/userModel";
import { Encrypt } from "../core/encrypt/encrypt";

class UsersCtrl{
    constructor(){

    }
    async getList(req: Request, res: Response){
        try {

            const response = await ModelUser.find({})
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getItem(req: Request, res: Response){
        const {id} = req.params;
        const response = await ModelUser.findById(id)
        res.json(response)
    }
    async post(req: Request, res: Response){
        const body = req.body;
        const response = await ModelUser.create(body)
        res.send(response);
    }

    async update(req: Request, res: Response){
        const {id} = req.params;
        const body = req.body;

        const response = await ModelUser.findByIdAndUpdate(id, body)

        
        res.json(response)
    }

    async delete(req: Request, res: Response){
        const {id} = req.params;
        const response = await ModelUser.findByIdAndDelete(id)
        res.json(response)
    }


}
export default new UsersCtrl();