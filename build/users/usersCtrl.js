"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersModel_1 = __importDefault(require("../users/usersModel"));
const encrypt_1 = require("../core/encrypt/encrypt");
class UsersCtrl {
    constructor() {
    }
    getList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield usersModel_1.default.find({});
                res.json(response);
            }
            catch (error) {
                if (error instanceof Error)
                    res.status(500).send(error.message);
            }
        });
    }
    getItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield usersModel_1.default.findById(id);
            res.json(response);
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const response = yield usersModel_1.default.create(body);
            res.send(response);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const body = req.body;
            encrypt_1.Encrypt.encryptPassword(body.password);
            const response = yield usersModel_1.default.findByIdAndUpdate(id, body);
            res.json(response);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield usersModel_1.default.findByIdAndDelete(id);
            res.json(response);
        });
    }
}
exports.default = new UsersCtrl();
//# sourceMappingURL=usersCtrl.js.map