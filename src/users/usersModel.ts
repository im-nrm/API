import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50
        },
        email:{
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
        },
        password:{
            type: String,
            required: true
            // minlength: 6
        }
    },
    {
        timestamps: true
    }
)

const ModelUser = mongoose.model("users", userModel);
export default ModelUser;