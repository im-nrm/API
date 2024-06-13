import  express, { Request, Response }  from "express";
import cors from "cors";
import morgan from "morgan";

//import dbconnect  from './config';
import run  from './config';
import usersRoutes from './users/usersRoutes';
import loginRoutes from "./login/loginRoutes";
import registerRoutes from './register/registerRoutes'

const PORT = process.env.PORT|| 5000;

const app = express()

app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

app.listen(PORT, () => {
    console.log('server up')
});

run();
