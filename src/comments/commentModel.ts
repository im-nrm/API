import mongoose from "mongoose";

const commentModel = new mongoose.Schema(
    {
        sourceFontId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'news' //TODO: mirar de hacer las referencias dependiendo de la source
        },
        createdBy:{
            type: mongoose.Types.ObjectId,
            require: true,
            ref: 'users'
        },
        commentBody: {
            type: String,
            required: true
        },
        numLikes: {
            type: Number,
            default: 0,
            min: 0
        },
        numDislikes: {
            type: Number,
            default: 0,
            min: 0
        },
        fixed: {
            type: Boolean,
            default: false
        },
        likedBy: {
            type: [mongoose.Types.ObjectId],
            ref: 'users'
        },
        responsesId: {
            type: [mongoose.Types.ObjectId],
            ref: 'comments'
        }

    },
    {
        timestamps: true
    }
)

const CommentModel = mongoose.model('comments', commentModel);
export default CommentModel;