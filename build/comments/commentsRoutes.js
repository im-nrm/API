"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsCtrl_1 = __importDefault(require("./commentsCtrl"));
const commentsRouter = express_1.default.Router({ mergeParams: true });
commentsRouter.route('/')
    .get(commentsCtrl_1.default.getList)
    .post(commentsCtrl_1.default.post);
commentsRouter.route('/:commentId')
    .put(commentsCtrl_1.default.update)
    .delete(commentsCtrl_1.default.delete);
commentsRouter.route('/:commentId/feedback')
    .post(commentsCtrl_1.default.postFeedback);
exports.default = commentsRouter;
//# sourceMappingURL=commentsRoutes.js.map