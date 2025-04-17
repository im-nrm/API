import { Request, Response } from "express";
import UserModel from "../users/userModel";
import { Encrypt } from "../core/encrypt/encrypt";
import jwt from 'jsonwebtoken';
import { sendMail } from "../core/mail_config/mail_config";

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
        }else if(user.validated === false){
            res.status(400).send({message: 'El usuario no esta validado'});
        }else{
            if(await Encrypt.comparePassword(body.password, user.password!)){
                // this.createCookie(res, user);

                await UserModel.findByIdAndUpdate(user._id, {lastLogin: new Date()});

                //XXX: check this => (https://stackoverflow.com/questions/55303400/mongoose-model-update-vs-save)
                // let foundUser = await userModel.findOneAndUpdate(
                //     { email: recievedEmail, password: hashedPassword },
                //     { $set: { lastLogin: new Date() }, $push: { myEvents: authEvent } }
                //    );

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
            /* ANTIGUO REGISTER SIN CONFIRMACION DE EMAIL
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
            .send({user: user, token});*/

            

            const token = jwt.sign(
                {id: user._id},
                process.env.SECRET_JWT_VERIFICATION!,
                {expiresIn: '1h'}
            )


            const link = `${process.env.API_URL}/auth/verify/${token}`
            await sendMail(user.email, 'Confirmar email', 'Por favor, confirma tu email', `<a href="${link}">Confirmar email</a>`);

            res.status(201).send({message: 'Usuario creado, revisa tu email para confirmar tu cuenta'});

        } catch (error) {
            if(error instanceof Error)
                res.status(500)//.send(error.message); //TODO: quitar error.message
        }

    }

    async resendValidation(req: Request, res: Response){
        const body = req.body;

        let user = null;
        if(body.email){
            user = await UserModel.findOne({ 
                email: body.email
            });
        }else if(body.username){
            user = await UserModel.findOne({ 
                username: body.username
            });
        }else{
            res.status(400).send({message: 'Error al encontrar al usuario'});
            return;
        }
        
        if(!user){
            res.status(400).send({message: 'El usuario no existe'});
            return;
        }
        if(user.validated){
            res.status(400).send({message: 'El usuario ya esta validado'});
            return;
        }

        try {
            const token = jwt.sign(
                {id: user._id},
                process.env.SECRET_JWT_VERIFICATION!,
                {expiresIn: '1h'}
            )
    
    
            const link = `${process.env.API_URL}/auth/verify/${token}`
            await sendMail(user.email, 'Confirmar email', 'Por favor, confirma tu email', `<a href="${link}">Confirmar email</a>`);
    
            res.status(201).send({message: 'Correo enviado, revisa tu email para confirmar tu cuenta'});
            
        } catch (error) {
            res.status(500).send({message: 'Error enviando correo'});
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

    async auth_cookie(req: Request, res: Response){
        console.log(req.session.user)
        if(req.session.user){

            const {id} = req.session.user;
            const user = await UserModel.findOne({ 
                _id: id
            });
    
            res.send(user);
        }else{
            console.log('0esta entrando aqui?')
            res.send(null);

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


    //TODO: quitar el test c:

    test_mail = async (req: Request, res: Response) => {
        let {to, subject, text, html} = req.body;

        subject = 'Test enviar correo'
        text = 'test enviando correos ;D'

        console.log(to, subject, text, html);


        try {
            await sendMail(to, subject, text, html);
            res.send('Correo enviado');
        } catch (error) {
            res.status(500).send('Error enviando correo');
        }
    }
    

    async verifyAccount(req: Request, res: Response){

        try{
            const {token} = req.params;
            const decoded = jwt.verify(token, process.env.SECRET_JWT_VERIFICATION!) as {id: string};

            console.log('decoded token', decoded.id);
            const user = await UserModel.findByIdAndUpdate(decoded.id, {validated: true});

            if(!user){
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            // TODO: hacer un false?
            res.redirect(`${process.env.PLATFORM_URL!}/login?validated=true`);

        }catch(error){
            res.status(400).json({ error: 'Token inválido o expirado' });
        }

    }

}
export default new authCtrl();