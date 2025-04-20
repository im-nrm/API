import mongoose from "mongoose";

const changelogModel = new mongoose.Schema(
    {
        type:{
            type: String,
            enum: ['Platform', 'API'],
            required: true,
        },
        version:{
            type: String,
            required: true,
        },
        description: {
            type: String,
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
const ChangelogModel = mongoose.model('comingSoon', changelogModel);
export default ChangelogModel;