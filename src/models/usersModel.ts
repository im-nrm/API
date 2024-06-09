import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        name:{
            type: String
        },
        email:{
            type: String
        },
        password:{
            type: String
        }
    },
    {
        timestamps: true
    }
)

const ModelUser = mongoose.model("users", userModel);
export default ModelUser;