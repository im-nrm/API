import { Request, Response } from "express";
import CommingSoonModel from "./commingSoonModel";

class CommingSoonCtrl{
    constructor(){

    }

    async getList(req:Request, res: Response){
        try {
            const response = await CommingSoonModel.find({})
            .populate('createdBy',{
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
        res.status(500).send('no implementado');
        return;
        try {
            const {id} = req.params;
            const response = await CommingSoonModel.findByIdAndUpdate(
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
                res.status(500).send(error);
        }
        
    }
    async post(req: Request, res: Response){
        const body = req.body;
        const {user} = req.session;

        if(['admin'].some(o=>o===user.role)){ 

            try{

                body.createdBy = user.id;
                
                const response = await CommingSoonModel.create(body)
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
        res.status(500).send('no implementado');
        return
        /*
        const {id} = req.params;
        const body = req.body;

        const response = await NewModel.findByIdAndUpdate(id, body)

        
        res.json(response)
        */
    }

    async delete(req: Request, res: Response){
        const {user} = req.session;
        
        if(['admin'].some(o=>o===user.role)){ //TODO: hacerlo de una forma mas elegante c:
            const {id} = req.params;
            const response = await CommingSoonModel.findByIdAndDelete(id)
            res.json(response)

        }else{
            res.sendStatus(403)
        }
             
        
    }

}

export default new CommingSoonCtrl();