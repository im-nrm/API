"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersCtrl_1 = __importDefault(require("../users/usersCtrl"));
const router = express_1.default.Router();
router.route('/')
    .get(usersCtrl_1.default.getList)
    .post(usersCtrl_1.default.post);
router.route('/:id')
    .get(usersCtrl_1.default.getItem)
    .put(usersCtrl_1.default.update)
    .delete(usersCtrl_1.default.delete);
exports.default = router;
//# sourceMappingURL=usersRoutes.js.map