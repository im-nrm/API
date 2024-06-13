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
class loginCtrl {
    constructor() {
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO: revisar que este correcto :D
            const body = req.body;
            const response = yield usersModel_1.default.findOne({
                $and: [{ username: body.username }, { password: body.password }]
            });
            // const response = await ModelUser.findOne({ 
            //     username: body.username
            // })
            if (!response) {
                res.status(404).send('Credenciales no validas');
            }
            else {
                res.send(response);
                // TODO: comparar con las pass encryptadas
                // if(await Encrypt.comparePassword(body.password, response.password!)){
                //     res.send(response);
                // }
            }
        });
    }
}
exports.default = new loginCtrl();
//# sourceMappingURL=loginCtrl.js.map