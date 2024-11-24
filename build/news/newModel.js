"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const newModel = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    bannerURL: {
        type: String, //TODO: URL de la imagen
    },
    officialSource: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'users'
    },
    numComments: {
        type: Number,
        default: 0
    },
    comments: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'comments'
    }
}, {
    timestamps: true
});
const NewModel = mongoose_1.default.model('news', newModel);
exports.default = NewModel;
//# sourceMappingURL=newModel.js.map