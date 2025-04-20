import { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "../users/userModel";
import InfoBlockModel from "./infoBlocksModel";

class InfoBlocksCtrl{
    constructor(){

    }

    async getList(req:Request, res: Response){
        try {
            const response = await InfoBlockModel.find({})
            .populate('createdBy',{
                email:1,
                username: 1,
                profilePhoto: 1
            })
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getActive(req:Request, res: Response){
        try {
            //TODO: tambien tener en cuenta el expirationDate
            const response = await InfoBlockModel.find({active: true})
            .sort({ createdAt: -1 })
            // No creo que sea necesario elm populate
            // .populate('createdBy',{
            //     email:1,
            //     username: 1,
            //     profilePhoto: 1
            // })
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getItem(req: Request, res: Response){
        res.status(500).send('no implementado');
        return;
        
    }
    async post(req: Request, res: Response){
        const body = req.body;
        const {user} = req.session;

        if(['admin'].some(o=>o===user.role)){ //TODO: hacerlo de una forma mas elegante c:

            //TODO: tratar duplicados peta server jeje

            try{

                body.createdBy = user.id;

                if(body.expirationDate){
                    let _aux = body.expirationDate
                    body.expirationDate = new Date(_aux);
                }
                console.log(body)
                const response = await InfoBlockModel.create(body)
                res.send(response);

            }catch(error){
                if(error instanceof Error)
                    res.status(500).send(error.message);
            }

        }else{
            res.sendStatus(403)
        }
        
    }

    async update(req: Request, res: Response){
        
        const body = req.body;
        const {user} = req.session;

        if(['admin'].some(o=>o===user.role)){ //TODO: hacerlo de una forma mas elegante c:
            const {id} = req.params;
            const response = await InfoBlockModel.findByIdAndUpdate(id, body)
            res.json(response)

        }else{
            res.sendStatus(403)
        }
    }

    async delete(req: Request, res: Response){
        const {user} = req.session;

        if(['admin'].some(o=>o===user.role)){ //TODO: hacerlo de una forma mas elegante c:
            const {id} = req.params;
            const response = await InfoBlockModel.findByIdAndDelete(id)
            res.json(response)

        }else{
            res.sendStatus(403)
        }
        
    }

}

export default new InfoBlocksCtrl();