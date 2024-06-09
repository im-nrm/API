import mongoose from "mongoose";

// const DB_URL = 'mongodb://localhost:27017/';
const DB_URL = 'mongodb+srv://nrm:api_test@api.33sl9ib.mongodb.net/?retryWrites=true&w=majority&appName=API'

const dbconnect = () =>{
    mongoose.set('strictQuery', true)
    mongoose.connect(DB_URL+'/sample_mflix', {}).then(
        () => { console.log('Connexion to DB OK') },
        (err: Error) => { console.log('Connexion to DB FAILED', err) }
      );
}

export default dbconnect;