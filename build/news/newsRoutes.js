"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsCtrl_1 = __importDefault(require("./newsCtrl"));
const commentsRoutes_1 = __importDefault(require("../comments/commentsRoutes"));
const newsRouter = express_1.default.Router();
newsRouter.route('/')
    .get(newsCtrl_1.default.getList)
    .post(newsCtrl_1.default.post);
newsRouter.route('/:id')
    .get(newsCtrl_1.default.getItem)
    .put(newsCtrl_1.default.update)
    .delete(newsCtrl_1.default.delete);
newsRouter.route('/:id/feedback')
    .post(newsCtrl_1.default.feedback);
newsRouter.use('/:id/comments', commentsRoutes_1.default);
exports.default = newsRouter;
//# sourceMappingURL=newsRoutes.js.map