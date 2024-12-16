import mongoose from "mongoose";

const tagModel = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true
        },
        expirationDate:{
            type: Date
        },
        createdBy:{
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    },
    {
        timestamps: true
    }
)

const TagModel = mongoose.model('tags', tagModel);
export default TagModel;