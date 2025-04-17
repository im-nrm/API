import { Request, Response } from "express";
import NewModel from "./newModel";
import mongoose from "mongoose";
import UserModel from "../users/userModel";
import { populate } from "dotenv";
import path from "path";
import FileUtils from "../core/upload_config/utils/fileUtils";

class NewsCtrl{
    constructor(){

    }

    async getList(req:Request, res: Response){
        try {


            
            //TODO: quitar en un futuro, no sera necesario, ya que se hara bien la paginacion

            //TODO: mirar algun metodo de paginacion :)
            //TODO: cambiar a const page y limit
            let page: number = parseInt(req.query.page as string) || 1;
            let limit: number = parseInt(req.query.limit as string) || 12; //TODO: ver si se cambia

            const approved = req.query.approved === 'false' ? false : true;
            console.log('a',req.query.approved, req.query.approved === 'false', req.query.approved === 'false' ? true : false)
            //TODO: quitar en un futuro, no sera necesario, ya que se hara bien la paginacion
            if(!approved){
                page = 1;
                limit = 999;
            }
/*
            let optionsPag = {
                page: page,
                limit: limit,
            }
            
            const response = await NewModel.find({})
            .sort({ createdAt: -1 })
            .populate('createdBy',{
                email:1,
                username: 1,
                    profilePhoto: 1
            }).populate('tags',{
                name:1
            }).paginate(optionsPag);
            res.json(response);*/

            const optionsPag = {
                page,
                limit,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'createdBy', select: 'email username' },
                    { path: 'tags', select: 'name' }
                ]
            };
            console.log('approved', approved);
            const response = await NewModel.paginate({approved: approved, editing: false}, optionsPag); //TODO: check en cambio de approved to state
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    //TODO: getBookmarks => GUEST
    async getBookmarks(req: Request, res: Response){
        const body = req.body;

        try {
            //TODO: mirar algun metodo de paginacion :)
            const response = await NewModel.find({ '_id': { $in: body } })
            .sort({ createdAt: -1 })
            .populate('createdBy',{
                email:1,
                username: 1,
                profilePhoto: 1
            }).populate('tags',{
                name:1
            });
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getNewsByUser(req: Request, res: Response){
        const {user} = req.session;
        try {
            const response = await NewModel.find({ 'createdBy': user.id })
            .sort({ createdAt: -1 })
            .populate('createdBy',{
                email:1,
                username: 1,
                profilePhoto: 1
            }).populate('tags',{
                name:1
            });
            res.json(response);
            
        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message);
        }
    }

    async getItem(req: Request, res: Response){
        //TODO: quedan popular todo, tendre que mirar si se puede extraer
        try {
            const {user} = req.session;
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

            if(user && response){

                const liked = response.likedBy.includes(user.id);

                const responseWithLikeStatus = {
                    ...response.toObject(),
                    liked
                };
                res.json(responseWithLikeStatus);

            }else{
                // Si el usuario no está logueado, devolver el response sin el parámetro liked
                res.json(response);
            }


        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message); //TODO: quitar error.message
        }
        
    }
    async post(req: Request, res: Response){
        const body = req.body;
        //TODO: validaciones back
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

        const {user} = req.session;
        if(!user){
            res.sendStatus(401);
            return;
        }

        try{
            const {action} = req.body;
            const newId = req.params.id;

            const newResponse = await NewModel.findById(newId);
            if(!newResponse){
                throw new Error('Noticia no encontrada');
            }

            let actionInUser, actionInNew;

            if(action === 'like' && !newResponse.likedBy.includes(user.id)){
                actionInUser = {$push: {newsLiked: newId}};
                actionInNew = {$inc: {likes: 1}, $push:{likedBy: user.id}};
                
            }else if(action === 'unlike' && newResponse.likedBy.includes(user.id)){
                actionInUser = {$pull: {newsLiked: newId}};
                actionInNew = {$inc: {likes: -1}, $pull:{likedBy: user.id}};

            }else{
                throw new Error('Accion no permitida');
            }

            await newResponse.updateOne(actionInNew, {session});

            await UserModel.findByIdAndUpdate(
                user.id,
                actionInUser,
                {session: session}
            );

            await session.commitTransaction();

            //Al ser post hay que enviar res.json, si no da un error en consola (no es importante ese error, pero para evitar ensuciar la consola)
            res.json({ success: true, message: 'ok' });


        } catch (error) {
            await session.abortTransaction();
            if(error instanceof Error)
                res.status(500).send(error.message); //TODO: quitar error.message
        } finally{
            session.endSession();
        }

    }

    async uploadImage(req: Request, res: Response) {
        
        const {user} = req.session;

        if(!['admin', 'editor'].some(o=>o===user.role)){//TODO: hacerlo de una forma mas elegante c:
            res.status(401).json({ message: "No tienes permiso" });
            return;
        }
        try {
            
            console.log('req.file', req.file);
            
            const file = req.file;

            if (!file) {
                res.status(400).json({ message: "No se ha subido ninguna imagen" });
                return
            }

            const {id} = req.params;
            if(!id){
                res.status(400).json({ message: "No se ha especificado el id" });
                return;
            }

            const newObject = await NewModel.findById(id);

            if(!newObject) {
                res.status(404).json({ message: "New not found" });
                return;
            }

            // Crear el directorio de la news, si es el coverImage, que lo guarde en una carpeta especifica
            let newDir;
            let _dir;
            if(req.query.coverImage === 'true'){
                _dir = `uploads/news/${newObject._id}/coverImage`;
                newDir = path.resolve(__dirname, `../../${_dir}`);
                FileUtils.ensureDirExists(newDir);

                if(newObject.coverImage) {
                    //valor por defecto, no se tiene que borrar
                    if(newObject.coverImage !== 'uploads/news/default/default.png') {
                        const oldFilePath = path.resolve(__dirname, `../../${newObject.coverImage}`);
                        FileUtils.deleteFileIfExists(oldFilePath);
                    }
                }

            }else{
                _dir = `uploads/news/${newObject._id}`
                newDir = path.resolve(__dirname, `../../${_dir}`);
                FileUtils.ensureDirExists(newDir);

            }

            const newFilePath = path.join(newDir, file.filename);
            
            await FileUtils.moveFile(file.path, newFilePath);

            // Guardar la nueva ruta en la base de datos
            const newPath = `${_dir}/${file.filename}`;
            console.log('newPath', newPath);
            if(req.query.coverImage === 'true'){
                console.log('entra aqui')
                await UserModel.findByIdAndUpdate(newObject._id, {coverImage: newPath});

            }

            res.send({path: newPath});


        } catch (error) {
            res.status(500).json({ message: "Server error", error });

            //XXX: v1-alpha.0.? => al ser un error intentar borrar la imgen en la carpeta tmp
        }
    };


    async update(req: Request, res: Response){

        const {user} = req.session;

        if(!['admin', 'editor'].some(o=>o===user.role)){//TODO: hacerlo de una forma mas elegante c:
            res.status(401).json({ message: "No tienes permiso" });
            return;
        }

        const {id} = req.params;
        const body = req.body;

        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const images: string[] = [];

        let match;
        while ((match = imgRegex.exec(body.body)) !== null) {
            images.push(path.basename(match[1]));
        }

        FileUtils.deleteFilesIfDontExists(path.resolve(__dirname, `../../uploads/news/${id}`), images);

        const response = await NewModel.findByIdAndUpdate(id, body)

        
        res.json(response)
    }

    async delete(req: Request, res: Response){
        res.sendStatus(501);
        return;
        const {id} = req.params;
        const response = await NewModel.findByIdAndDelete(id)
        res.json(response)
    }

}

export default new NewsCtrl();