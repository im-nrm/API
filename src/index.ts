import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

//import dbconnect  from './config';
import run  from './config';
import usersRoutes from './users/usersRoutes';
import authRoutes from "./auth/authRoutes";
import newsRoutes from './news/newsRoutes';
import tagsRouter from "./tags/tagsRoutes";
import comingSoonRouter from "./comingSoon/comingSoonRoutes";
import bugReportRouter from "./bugReport/bugReportRoutes";
import path from "path";
import infoBlocksRouter from "./infoBlocks/infoBlocksRoutes";

const PORT = process.env.PORT|| 5000;

const app = express()

app.disable('x-powered-by');
//TODO: check zod to validations

const corsOptions = {
    // set origin to a specific origin.
    origin: 'http://localhost:4200',
    
    // or, set origin to true to reflect the request origin
    //origin: true,
  
    credentials: true,
    optionsSuccessStatus: 200,
  };

app.use(morgan('dev'));
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

//Archivos estaticos:
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use((req: Request, res: Response, next) =>{
    const token = req.cookies.access_token;
    let data = null;

    //https://www.youtube.com/watch?v=UqnnhAZxRac
    // min 1:33:00
    req.session = {user: null};
    try {
        data = jwt.verify(token, process.env.SECRET_JWT_KEY!);
        req.session.user = data;
    } catch{}

    next();
});

app.use('', authRoutes);
app.use('/users', usersRoutes);
app.use('/news', newsRoutes);
app.use('/tags', tagsRouter);
app.use('/comingSoon', comingSoonRouter);
app.use('/bugReport', bugReportRouter);
app.use('/infoBlocks', infoBlocksRouter);

app.use("/ttt", express.static(path.join(__dirname, "../../uploads")));

app.listen(PORT, () => {
    console.log('server up')
});

run();
