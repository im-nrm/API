import  express from "express";
import cors from "cors";
import morgan from "morgan";

//import dbconnect  from './config';
import run  from './config';
import usersRoutes from './users/usersRoutes';
import authRoutes from "./auth/authRoutes";
import newsRoutes from './news/newsRoutes';

const PORT = process.env.PORT|| 5000;

const app = express()

app.disable('x-powered-by');
//TODO: check zod to validations

app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

app.use('', authRoutes);
app.use('/users', usersRoutes);
app.use('/news', newsRoutes);

app.listen(PORT, () => {
    console.log('server up')
});

run();
