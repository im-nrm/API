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
const userModel_1 = __importDefault(require("../users/userModel"));
const encrypt_1 = require("../core/encrypt/encrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class authCtrl {
    constructor() {
    }
    postLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            console.log();
            const response = yield userModel_1.default.findOne({
                username: body.username
            });
            if (!response) {
                res.status(404).send({ message: 'El usuario no existe' });
            }
            else {
                if (yield encrypt_1.Encrypt.comparePassword(body.password, response.password)) {
                    const token = jsonwebtoken_1.default.sign({ id: response._id, username: response.username }, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });
                    res.cookie('access_token', token, {
                        httpOnly: true, //solo se accede desde el servidor
                        secure: process.env.NODE_ENV === 'prod', //solo https (dev disabled)
                        sameSite: 'strict', //solo se puede acceder desde el mismo dominio
                        maxAge: 1000 * 60 * 60 //solo tiene validez 1h //TODO: hacer refresh_token
                    })
                        .send({ user: response, token });
                }
                else {
                    res.status(404).send({ message: 'Contraseña invalida' });
                }
            }
        });
    }
    postRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = new authCtrl();
//# sourceMappingURL=authCtrl.js.map