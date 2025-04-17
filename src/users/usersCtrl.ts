import { Request, Response } from "express";
import UserModel from "../users/userModel";
import path from "path";
import fs from "fs";
import FileUtils from "../core/upload_config/utils/fileUtils";

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
        res.sendStatus(501);
        return;
        const {id} = req.params;
        const response = await UserModel.findByIdAndDelete(id)
        res.json(response)
    }

    async uploadProfileImage(req: Request, res: Response) {
        const {id} = req.session.user;
        if(!id){
            res.sendStatus(401);
            return;
        }
        try {
            
            console.log('req.file', req.file);
            
            const file = req.file;

            if (!file) {
                res.status(400).json({ message: "No se ha subido ninguna imagen" });
                return
            }

            const user = await UserModel.findById(id);

            if(!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Crear el directorio del usuario si no existe
            const userDir = path.resolve(__dirname, `../../uploads/users/profilephoto/${user._id}`);
            FileUtils.ensureDirExists(userDir);

            const newFilePath = path.join(userDir, file.filename);
            
            if (user.profilePhoto) {
                //valor por defecto, no se tiene que borrar
                if(user.profilePhoto !== 'uploads/users/profilephoto/default/default.png') {
                    const oldFilePath = path.resolve(__dirname, `../../${user.profilePhoto}`);
                    FileUtils.deleteFileIfExists(oldFilePath);
                }
                
            }
            await FileUtils.moveFile(file.path, newFilePath);

            // Guardar la nueva ruta en la base de datos
            const newPath = `uploads/users/profilephoto/${user.id}/${file.filename}`;

            await UserModel.findByIdAndUpdate(user._id, {profilePhoto: newPath});

            res.status(200).send({message: 'OK'});


        } catch (error) {
            res.status(500).json({ message: "Server error", error });
        }
    };


}
export default new UsersCtrl();