"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersCtrl_1 = __importDefault(require("../users/usersCtrl"));
const usersRouter = express_1.default.Router();
usersRouter.route('/')
    .get(usersCtrl_1.default.getList)
    .post(usersCtrl_1.default.post);
usersRouter.route('/:id')
    .get(usersCtrl_1.default.getItem)
    .put(usersCtrl_1.default.update)
    .delete(usersCtrl_1.default.delete);
exports.default = usersRouter;
//# sourceMappingURL=usersRoutes.js.map