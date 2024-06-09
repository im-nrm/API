import  express, { Request, Response }  from "express";
import cors from "cors";
import morgan from "morgan";

//import dbconnect  from './config';
import run  from './config';
import usersRoutes from './routes/usersRoutes';

const PORT = process.env.PORT || 5000;

const app = express()

app.get('/', (req: Request, res: Response) => {
    console.log('get /')
    res.send('get /');
})

app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

app.use('/users', usersRoutes);

app.listen(PORT, () => {
    console.log('server up')
});

run();