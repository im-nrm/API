import { Request, Response } from "express";
import { Encrypt } from "../core/encrypt/encrypt";
import UserModel from "../users/userModel";

class UsersCtrl{
    constructor(){

    }
    async getList(req: Request, res: Response){
        try {
            
            const response = await UserModel.find({})
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getItem(req: Request, res: Response){
        const {id} = req.params;
        const response = await UserModel.findById(id)
        res.json(response)
    }
    async post(req: Request, res: Response){
        const body = req.body;
        const response = await UserModel.create(body)
        res.send(response);
    }

    async update(req: Request, res: Response){
        const {id} = req.params;
        const body = req.body;

        const response = await UserModel.findByIdAndUpdate(id, body)

        
        res.json(response)
    }

    async delete(req: Request, res: Response){
        const {id} = req.params;
        const response = await UserModel.findByIdAndDelete(id)
        res.json(response)
    }


}
export default new UsersCtrl();