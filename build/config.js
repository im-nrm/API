"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
const URL = process.env.MONGODB_URL;
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connect = yield mongoose_1.default.connect(URL);
        console.log('conectado a MongoDB');
        return connect;
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = run;
//run().catch(console.dir);
//# sourceMappingURL=config.js.map