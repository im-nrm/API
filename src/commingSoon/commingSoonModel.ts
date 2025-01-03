import mongoose from "mongoose";

const commingSoonModel = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        subtitle:{
            type: String,
        },
        description: {
            type: String,
        },
        icon:{
            type: String,
        },
        disabled:{
            type: Boolean,
            default: false
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
//TODO: check: si es necesario añadir mas cosas
//TODO 2: añadir esto en el esquema c:
const CommingSoonModel = mongoose.model('commingSoon', commingSoonModel);
export default CommingSoonModel;