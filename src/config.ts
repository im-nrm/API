import mongoose from "mongoose";

const DB_URL = 'mongodb://localhost:27017/';

const dbconnect = () =>{
    mongoose.set('strictQuery', true)
    mongoose.connect(DB_URL+'API_test', {}).then(
        () => { console.log('Connexion to DB OK') },
        (err: Error) => { console.log('Connexion to DB FAILED', err) }
      );
}

export default dbconnect;