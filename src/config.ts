import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from "dotenv"

dotenv.config();
// const DB_URL = 'mongodb://localhost:27017/';

// const dbconnect = () =>{
//     mongoose.set('strictQuery', true)
//     mongoose.connect(DB_URL+'/sample_mflix', {}).then(
//         () => { console.log('Connexion to DB OK') },
//         (err: Error) => { console.log('Connexion to DB FAILED', err) }
//       );
// }

// export default dbconnect;
// const URL = process.env.MONGODB_URL;
// console.log(URL)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(URL + '/API', {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

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
//run().catch(console.dir);