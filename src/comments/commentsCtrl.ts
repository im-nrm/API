import { Request, Response } from "express";
import CommentModel from "./commentModel";
import mongoose from "mongoose";
import NewModel from "../news/newModel";

class CommentsCtrl{
    constructor(){

    }

    async getList(req:Request, res: Response){
        try {
            const {id} = req.params;
            if(!id){
                res.status(400).send({message: 'No se esta pasando la ID'});
            }
            const response = await CommentModel.find({}).populate('createdBy',{
                email:1,
                username: 1
                //TODO: añadir todos los campos
            }).populate('responsesId').populate('likedBy',{
                email:1,
                username: 1
            })
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getResponseList(req:Request, res: Response){
        try {
            //TODO: get responses
            const response = await CommentModel.find({}).populate('createdBy',{
                email:1,
                username: 1
                //TODO: añadir todos los campos
            }).populate('responsesId').populate('likedBy',{
                email:1,
                username: 1
            })
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }
    async getItem(req: Request, res: Response){
        const {id} = req.params;
        const response = await CommentModel.findById(id).populate('createdBy',{
            email:1,
            username: 1
        })
        res.json(response)
    }
    async post(req: Request, res: Response){

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            
            const body = req.body;
            const newComment = new CommentModel(body);
            const saveComment = await newComment.save({session});

            //Update de la noticia
            //TODO: ver si se puede hacer generico para reutilizar los comentarios
            await NewModel.findByIdAndUpdate(
                newComment.sourceFontId,
                {
                    $inc: {numComments: 1},
                    $push: {comments: saveComment._id}
                },
                {session}
            );


            // commit de los cambios
            await session.commitTransaction();
            session.endSession();

            res.send(newComment);
            
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error instanceof Error){
                res.status(500).json({ error: error.message }); //TODO: no enviar nunca error.message
            }else{
                res.status(500);
            }
            
        }
        
    }

    async postFeedback(req: Request, res: Response){
        const {id} = req.params;
        const {commentId} = req.params;
        const {important} = req.params; //si es importante se añadira a likedBy
        const body = req.body;

        const response = await CommentModel.findById(commentId).select({
            numLikes: 1,
            numDislikes: 1
        });
        res.status(500).send('No se ha implementado :S')

    }

    async update(req: Request, res: Response){
        const {id} = req.params;
        const {commentId} = req.params;
        const body = req.body;

        res.status(500).send('Implementadon de update por hacer c:')
        return
        const response = await CommentModel.findByIdAndUpdate(commentId, body)

        
        res.json(response)
    }

    async delete(req: Request, res: Response){
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const {commentId, id} = req.params;

            const comment = await CommentModel.findById(commentId).session(session);
            if (!comment) {
                throw new Error('Comentario no encontrado');
            }

            await comment.deleteOne({_id: commentId}).session(session);

            const newModel = await NewModel.findByIdAndUpdate(
                id,
                {
                    $inc:{numComments: -1},
                    $pull: {comments: commentId}
                },
                {session, new: true}
            );

            await session.commitTransaction();
            session.endSession();

            res.send(newModel);
            
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            if(error instanceof ErrorEvent){
                res.status(500).send(error.message);
            }
        }
        
    }

}

export default new CommentsCtrl();