import  express, { Request, Response }  from "express";
import cors from "cors";
import morgan from "morgan";

import dbconnect  from './config'
import usersRoutes from './routes/usersRoutes'

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const app = express()

app.get('/', (req: Request, res: Response) => {
    console.log('get /')
    res.send('get /');
})

app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

app.use('/users', usersRoutes);

app.listen(HTTPS_PORT, () => {
    console.log('server up')
});

dbconnect();