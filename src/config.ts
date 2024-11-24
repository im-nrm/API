import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from "dotenv"

dotenv.config();

const URL = process.env.MONGODB_URL!;

const run = async()=>{
  try {
    const connect = await mongoose.connect(URL);
    console.log('conectado a MongoDB');
    return connect;

  } catch (error) {
    console.log(error)
  }
}


export default run;