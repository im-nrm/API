"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authCtrl_1 = __importDefault(require("./authCtrl"));
const authRouter = express_1.default.Router();
authRouter.route('/login')
    .post(authCtrl_1.default.postLogin);
authRouter.route('/register')
    .post(authCtrl_1.default.postRegister); //TODO: register
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map