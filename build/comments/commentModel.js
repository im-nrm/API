"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel = new mongoose_1.default.Schema({
    sourceFontId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'news' //TODO: mirar de hacer las referencias dependiendo de la source
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
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
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'users'
    },
    responsesId: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'comments'
    }
}, {
    timestamps: true
});
const CommentModel = mongoose_1.default.model('comments', commentModel);
exports.default = CommentModel;
//# sourceMappingURL=commentModel.js.map