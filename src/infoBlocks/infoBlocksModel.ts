import mongoose from "mongoose";

const infoBlockModel = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        body:{
            type: String,
            required: true
        },
        active:{
            type: Boolean,
            default: false
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

const InfoBlockModel = mongoose.model('infoBlock', infoBlockModel);
export default InfoBlockModel;