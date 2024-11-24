"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true
        // minlength: 6
    },
    photoUrl: {
        type: String
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
    achievements: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'achievements'
    },
    commentsLiked: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'comments'
    },
    commentsDisliked: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'comments'
    },
    newsLiked: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'news'
    },
    newsBookmarked: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'news'
    }
}, {
    timestamps: true
});
const UserModel = mongoose_1.default.model("users", userModel);
exports.default = UserModel; //TODO: UserModel
//# sourceMappingURL=userModel.js.map