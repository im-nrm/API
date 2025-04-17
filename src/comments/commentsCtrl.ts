import { Request, Response } from "express";
import CommentModel from "./commentModel";
import mongoose from "mongoose";
import NewModel from "../news/newModel";

class CommentsCtrl{
    constructor(){

    }

    async getList(req:Request, res: Response){
        const {user} = req.session;

        try {
            const {id} = req.params;
            if(!id){
                res.status(400).send({message: 'No se esta pasando la ID'});
                return;
            }
            const response = await CommentModel.find({sourceFontId: id, parentId: { $exists: false }}).populate('createdBy',{
                email:1,
                username: 1,
                profilePhoto: 1
                //TODO: añadir todos los campos
            }).populate('favoriteBy',{
                email:1,
                username: 1,
                profilePhoto: 1
                //TODO: añadir todos los campos
            })

            if(user && response){
                //TODO: en un furuto tendra que hacerse generico
                const newResponse = await NewModel.findById(id);
                let canFav = (newResponse?.createdBy.toString() === user.id || user.role === 'admin')

                let responseWithFeedback: any[] = [];
                response.forEach((comment) => {
                    const liked = comment.likedBy.includes(user.id);
                    const disliked = comment.dislikedBy.includes(user.id);
                    const faved = comment.favoriteBy.some((fav) => fav._id.toString() === user.id );

                    responseWithFeedback.push({
                        ...comment.toObject(),
                        liked,
                        disliked,
                        faved,
                        canFav
                    })
                });
                res.json(responseWithFeedback);

            }else{
                // Si el usuario no está logueado, devolver el response sin el parámetro liked
                res.json(response);
            }

        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getResponseList(req:Request, res: Response){
        const {user} = req.session;

        try {
            const {id} = req.params;
            const {commentId} = req.params;
            //TODO: get responses
            const response = await CommentModel.find({sourceFontId: id, parentId: commentId}).populate('createdBy',{
                email:1,
                username: 1,
                profilePhoto: 1
                //TODO: añadir todos los campos
            }).populate('favoriteBy',{
                email:1,
                username: 1,
                profilePhoto: 1
                //TODO: añadir todos los campos
            })
            if(user && response){

                const newResponse = await NewModel.findById(id);
                let canFav = (newResponse?.createdBy.toString() === user.id || user.role === 'admin')

                let responseWithFeedback: any[] = [];
                response.forEach((comment) => {
                    const liked = comment.likedBy.includes(user.id);
                    const disliked = comment.dislikedBy.includes(user.id);
                    const faved = comment.favoriteBy.some((fav) => fav._id.toString() === user.id );


                    responseWithFeedback.push({
                        ...comment.toObject(),
                        liked,
                        disliked,
                        faved,
                        canFav
                    })
                });
                res.json(responseWithFeedback);

            }else{
                // Si el usuario no está logueado, devolver el response sin el parámetro liked
                res.json(response);
            }
            
        } catch (error) {
            // if(error instanceof Error)
                // res.status(500).send(error.message);
        }
    }
    
    async getItem(req: Request, res: Response, id: string, user: any){
        // const {user} = req.session;
        // const {id} = req.params;
        try {
            const comment = await CommentModel.findById(id);

            if(user && comment){
                const liked = comment.likedBy.includes(user.id);
                const disliked = comment.dislikedBy.includes(user.id);
                const response = {
                    ...comment.toObject(),
                    liked,
                    disliked 
                }
                
                return response;
    
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send(error.message);
            }
            return null;
        }

    }
    async post(req: Request, res: Response){

        const {user} = req.session;

        if(user && user.id){
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                
                const body = req.body;
                body.createdBy = user.id;


                const newComment = new CommentModel(body);
                const saveComment = (await newComment.save({session}));

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

                // SI es una respuesta, tendra parentId, por lo que hay que actualizar el comentario padre
                if(body.parentId){

                    await CommentModel.findByIdAndUpdate(
                        body.parentId,
                        {
                            $inc: {numResponses: 1},
                            $push: {responsesId: saveComment._id}
                        },
                        {session}
                    );

                }


                // commit de los cambios
                await session.commitTransaction();
                session.endSession();
                
                res.send(await newComment.populate('createdBy',{
                    email:1,
                    username: 1,
                    profilePhoto: 1
                    //TODO: añadir todos los campos
                
                }));
                
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                if (error instanceof Error){
                    // res.status(500).json({ error: error.message }); //TODO: no enviar nunca error.message
                }else{
                    res.status(500);
                }
                
            }
        }else{
            res.sendStatus(403);
        }

        
        
    }

    async postFeedback (req: Request, res: Response){
        const{id} = req.params;
        const {commentId} = req.params;
        const {action} = req.body;
        const {user} = req.session;

        if(user && user.id){
            try {

                let update;
                const comment = await CommentModel.findById(commentId);

                if(comment){
                    const liked = comment.likedBy.includes(user.id);
                    const disliked = comment.dislikedBy.includes(user.id);
        
                    if(action === 'like' || action === 'unlike'){
    
                        if(action === 'like' && !liked){
                            update = {
                                $inc: {numLikes: 1},
                                $push:{likedBy: user.id}
                            }
                            if(disliked){
                                update = {
                                    ...update,
                                    $inc: { ...update.$inc, numDislikes: -1 },
                                    $pull: { dislikedBy: user.id }
                                };
                            }  

    
                        }else if(action === 'unlike' && liked){
                            update = {
                                $inc: {numLikes: -1},
                                $pull:{likedBy: user.id}
                            }

                        }
    
                    }else if(action === 'dislike' || action === 'undislike'){
                            
                        if(action === 'dislike' && !disliked){
                            update = {
                                $inc: {numDislikes: 1},
                                $push:{dislikedBy: user.id}
                            }
                            if(liked){
                                update = {
                                    ...update,
                                    $inc: { ...update.$inc, numLikes: -1 },
                                    $pull: { likedBy: user.id }
                                };
                            }  

                        }else if(action === 'undislike' && disliked){
                            update = {
                                $inc: {numDislikes: -1},
                                $pull:{dislikedBy: user.id}
                            }

                        }
                    }else{
                        throw new Error('Acción no permitida');
                    }

                    if(update){
                        await comment.updateOne(update);
                        res.json({ success: true, message: 'ok' });

                    }else{
                        throw new Error('Acción no permitida');
                    }

                }else{
                    throw new Error('Comentario no encontrado');

                }
                
            } catch (error) {
                if (error instanceof Error){
                    res.status(500).json({ error: error.message }); //TODO: no enviar nunca error.message
                }else{
                    res.status(500);
                }
                
            }
        }
    }

    async postFavorite (req: Request, res: Response){
        const{id} = req.params;
        const {commentId} = req.params;
        const {action} = req.body;
        const {user} = req.session;

        if(user && user.id){
            try {

                const newResponse = await NewModel.findById(id);
                if(newResponse?.createdBy.toString() === user.id || user.role === 'admin'){
                    let update;
                    if(action === 'fav'){
                        update = {
                            $push:{favoriteBy: user.id}
                        }

                    }else if (action === 'unfav'){
                        update = {
                            $pull:{favoriteBy: user.id}
                        }
                    }else {
                        throw new Error('Acción no permitida');
                    }

                    if(update){
                        const comment = await CommentModel.findByIdAndUpdate(commentId,update, {new:true})
                        .populate('favoriteBy', {
                            email: 1,
                            username: 1,
                            //TODO: añadir foto de perfil
                        });
                        console.log(comment)
                        res.send(comment);

                    }else{
                        throw new Error('Acción no permitida');
                    }


                }


                
            } catch (error) {
                if (error instanceof Error){
                    res.status(500).json({ error: error.message }); //TODO: no enviar nunca error.message
                }else{
                    res.status(500);
                }
                
            }
        }
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