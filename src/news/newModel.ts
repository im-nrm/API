import mongoose from "mongoose";

const newModel = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        body:{
            type: String,
            required: true
        },
        bannerURL:{
            type: String, //TODO: URL de la imagen
        },
        officialSource:{
            type: String
        },
        views:{
            type: Number,
            default: 0
        },
        createdBy:{
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        likes:{
            type: Number,
            default:0
        },
        likedBy:{
            type: [mongoose.Types.ObjectId],
            ref: 'users'
        },
        numComments:{
            type: Number,
            default: 0
        },
        comments: {
            type: [mongoose.Types.ObjectId],
            ref: 'comments'

        }
    },
    {
        timestamps: true
    }
)

const NewModel = mongoose.model('news', newModel);
export default NewModel;