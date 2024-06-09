import  express  from "express";
import cors from "cors";
import morgan from "morgan";

import dbconnect  from './config'
import usersRoutes from './routes/usersRoutes'

const app = express()


app.use(morgan('dev'));
app.use(cors())
app.use(express.json());

app.use('/users', usersRoutes);

app.listen(3002, () => {
    console.log('server up')
});

dbconnect();