import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50//TODO: check maxlength
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
        },
        profilePhoto:{
            type: String,
            default: 'uploads/users/profilephoto/default/default.png'
        },
        name: {
            type: String
        },
        lastname: {
            type: String
        },
        birthDate: {
            type: Date
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'editor'], //TODO: añadir diferentes roles
            default: 'user'
        },
        achievements: {
            type: [mongoose.Types.ObjectId],
            ref: 'achievements'
        },
        commentsLiked:{
            type: [mongoose.Types.ObjectId],
            ref: 'comments'
        },
        commentsDisliked:{
            type: [mongoose.Types.ObjectId],
            ref: 'comments'
        },
        newsLiked:{
            type: [mongoose.Types.ObjectId],
            ref: 'news'
        },
        newsBookmarked:{
            type: [mongoose.Types.ObjectId],
            ref: 'news'
        },
        newsCreated:{
            type: [mongoose.Types.ObjectId],
            ref: 'news'
        },
        validated:{
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

//TODO: añadir al miro las variables faltantes

const UserModel = mongoose.model("users", userModel);
export default UserModel; //TODO: UserModel

