import { Request, Response } from "express";
import UserModel from "../users/userModel";
import { Encrypt } from "../core/encrypt/encrypt";
import jwt from 'jsonwebtoken';

class authCtrl{
    constructor(){

    }

    async postLogin(req: Request, res: Response){
        const body = req.body;

        const user = await UserModel.findOne({ 
            username: body.username
        });


        if(!user){
            res.status(404).send({message: 'El usuario no existe'});
        }else{
            if(await Encrypt.comparePassword(body.password, user.password!)){
                // this.createCookie(res, user);
                const token = jwt.sign(
                    {id: user._id,username: user.username, role: user.role},
                    process.env.SECRET_JWT_KEY!,
                    {expiresIn: '1h'}
                )

                res.cookie('access_token', token, {
                    httpOnly: true, //solo se accede desde el servidor
                    path: '/',
                    domain: undefined,
                    secure: process.env.NODE_ENV === 'prod', //solo https (dev disabled)
                    sameSite: 'lax',//'strict', //solo se puede acceder desde el mismo dominio
                    maxAge: 1000*60*60 //solo tiene validez 1h //TODO: hacer refresh_token
                })
                .send({user: user, token});
            }else{
                res.status(404).send({message: 'Contraseña invalida'});
            }
        }
    }

    async postRegister (req: Request, res: Response){
        const body = req.body;
        //TODO: ahora solo hay username, email, password

        const checkUser = await UserModel.findOne({ 
            username: body.username
        });
        if(checkUser){
            res.status(400).send({message: 'El nombre de usuario ya existe'});
            return;
        }

        const checkMail = await UserModel.findOne({ 
            email: body.email
        });
        if(checkMail){
            res.status(400).send({message: 'El email ya existe'});
            return;
        }

        try {
    
            body.password = Encrypt.encryptPassword(body.password);
    
            const user = await UserModel.create(body);

            // this.createCookie(res, user);
            const token = jwt.sign(
                {id: user._id,username: user.username, role: user.role},
                process.env.SECRET_JWT_KEY!,
                {expiresIn: '1h'}
            )
    
            res.cookie('access_token', token, {
                httpOnly: true, //solo se accede desde el servidor
                path: '/',
                domain: undefined,
                secure: process.env.NODE_ENV === 'prod', //solo https (dev disabled)
                sameSite: 'lax',//'strict', //solo se puede acceder desde el mismo dominio
                maxAge: 1000*60*60 //solo tiene validez 1h //TODO: hacer refresh_token
            })
            .send({user: user, token});

        } catch (error) {
            if(error instanceof Error)
                res.status(500).send(error.message); //TODO: quitar error.message
        }

    }

    async postLogout (req: Request, res: Response){
        //TODO:
        res.clearCookie('access_token').send({message: 'Logout'});
    }

    async get_user_with_cookie_test(req: Request, res: Response){
        if(req.session.user){

            const {id} = req.session.user;
            const user = await UserModel.findOne({ 
                _id: id
            });
    
            res.send(user);
        }else{
            res.status(204);
        }
        
    }

    //TODO: intentar hacerlo funcion para reutilizarlo en login/register
    // se intento hacer asyn y quitarndo guncion flecha pero nada XD
    createCookie = (res:Response, user:any) =>{
        const token = jwt.sign(
            {id: user._id,username: user.username, role: user.role},
            process.env.SECRET_JWT_KEY!,
            {expiresIn: '1h'}
        )

        res.cookie('access_token', token, {
            httpOnly: true, //solo se accede desde el servidor
            path: '/',
            domain: undefined,
            secure: process.env.NODE_ENV === 'prod', //solo https (dev disabled)
            sameSite: 'lax',//'strict', //solo se puede acceder desde el mismo dominio
            maxAge: 1000*60*60 //solo tiene validez 1h //TODO: hacer refresh_token
        })
        .send({user: user, token});
    }

}
export default new authCtrl();