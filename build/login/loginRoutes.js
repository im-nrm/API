"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginCtrl_1 = __importDefault(require("./loginCtrl"));
const router = express_1.default.Router();
router.route('/')
    .post(loginCtrl_1.default.post);
exports.default = router;
//# sourceMappingURL=loginRoutes.js.map