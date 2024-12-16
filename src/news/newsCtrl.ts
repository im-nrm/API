import { Request, Response } from "express";
import NewModel from "./newModel";
import mongoose from "mongoose";
import UserModel from "../users/userModel";

class NewsCtrl{
    constructor(){

    }

    async getList(req:Request, res: Response){
        try {
            //TODO: mirar algun metodo de paginacion :)
            const response = await NewModel.find({})
            .sort({ createdAt: -1 })
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
            }).populate('tags',{
                name:1
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
        const {user} = req.session;

        if(['admin', 'editor'].some(o=>o===user.role)){ //TODO: hacerlo de una forma mas elegante c:

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                
                body.createdBy = user.id;

                const newNew = new NewModel(body);
                const saveNew = await newNew.save({session});

                await UserModel.findByIdAndUpdate(
                    user.id,
                    {
                        $push: {newsCreated: saveNew._id}
                    },
                    {session}
                )

                await session.commitTransaction();
                session.endSession();

                res.send(saveNew);
                
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                if (error instanceof Error){
                    res.status(500).json({ error: error.message }); //TODO: no enviar nunca error.message
                }else{
                    res.status(500);
                }
            }
        }else{
            res.sendStatus(403)
        }
        
    }

    async feedback(req: Request, res: Response){
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const {userId, action} = req.body;
            const newId = req.params.id;

            let actionInUser, actionInNew= {};
            if(action === 'like'){
                actionInUser = {$push: {newsLiked: newId}};
                actionInNew = {$inc: {likes: 1}, $push:{likedBy: userId}};

            }else if(action === 'unlike'){
                actionInUser = {$pull: {newsLiked: newId}};
                actionInNew = {$inc: {likes: -1}, $pull:{likedBy: userId}};

            }else{
                throw new Error('Accion no permitida');
            }

            console.log(actionInUser, actionInNew)

            const user = await UserModel.findByIdAndUpdate(
                userId,
                actionInUser,
                {session: session}
            );
            
            // TODO: con validadores se podra hacer?
            // if(user?.newsLiked.some(o => String(o) === newId) && action === 'like'){
            //     throw new Error('Ya le habia dado like');
            // }

            await NewModel.findByIdAndUpdate(
                newId,
                actionInNew,
                {session: session}
            );

            await session.commitTransaction();
            session.endSession();

            res.send('ok');
            
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if(error instanceof Error)
                res.status(500).send(error.message); //TODO: quitar error.message
        }

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