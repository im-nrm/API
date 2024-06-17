import { Request, Response } from "express";
import NewModel from "./newModel";
import mongoose from "mongoose";

class NewsCtrl{
    constructor(){

    }

    async getList(req:Request, res: Response){
        try {
            //TODO: mirar algun metodo de paginacion :)
            const response = await NewModel.find({}).populate('createdBy',{
                email:1,
                username: 1
                //TODO: add photo
            })
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }
    async getItem(req: Request, res: Response){
        //TODO: quedan popular todo, tendre que mirar si se puede extraer
        try {
            const {id} = req.params;
            const response = await NewModel.findByIdAndUpdate(
                id,
                {
                    $inc: {views: 1}
                },
                {new: true} // el new: true devuelve el valor ya updateado
            ).populate('createdBy',{
                email:1,
                username: 1,
                photoUrl: 1
            });

            console.log(response)

            // commit de los cambios

            res.json(response);

        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message); //TODO: quitar error.message
        }
        
    }
    async post(req: Request, res: Response){
        const body = req.body;
        const response = await NewModel.create(body)
        res.send(response);
    }

    async update(req: Request, res: Response){
        const {id} = req.params;
        const body = req.body;

        const response = await NewModel.findByIdAndUpdate(id, body)

        
        res.json(response)
    }

    async delete(req: Request, res: Response){
        const {id} = req.params;
        const response = await NewModel.findByIdAndDelete(id)
        res.json(response)
    }

}

export default new NewsCtrl();