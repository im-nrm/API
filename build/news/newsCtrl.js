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
const newModel_1 = __importDefault(require("./newModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../users/userModel"));
class NewsCtrl {
    constructor() {
    }
    getList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //TODO: mirar algun metodo de paginacion :)
                const response = yield newModel_1.default.find({}).populate('createdBy', {
                    email: 1,
                    username: 1
                    //TODO: add photo
                });
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
            //TODO: quedan popular todo, tendre que mirar si se puede extraer
            try {
                const { id } = req.params;
                const response = yield newModel_1.default.findByIdAndUpdate(id, {
                    $inc: { views: 1 }
                }, { new: true } // el new: true devuelve el valor ya updateado
                ).populate('createdBy', {
                    email: 1,
                    username: 1,
                    photoUrl: 1
                });
                console.log(response);
                // commit de los cambios
                res.json(response);
            }
            catch (error) {
                if (error instanceof Error)
                    res.status(500).send(error.message); //TODO: quitar error.message
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const response = yield newModel_1.default.create(body);
            res.send(response);
        });
    }
    feedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const { userId, action } = req.body;
                const newId = req.params.id;
                let actionInUser, actionInNew = {};
                if (action === 'like') {
                    actionInUser = { $push: { newsLiked: newId } };
                    actionInNew = { $inc: { likes: 1 }, $push: { likedBy: userId } };
                }
                else if (action === 'unlike') {
                    actionInUser = { $pull: { newsLiked: newId } };
                    actionInNew = { $inc: { likes: -1 }, $pull: { likedBy: userId } };
                }
                else {
                    throw new Error('Accion no permitida');
                }
                console.log(actionInUser, actionInNew);
                const user = yield userModel_1.default.findByIdAndUpdate(userId, actionInUser, { session: session });
                // TODO: con validadores se podra hacer?
                // if(user?.newsLiked.some(o => String(o) === newId) && action === 'like'){
                //     throw new Error('Ya le habia dado like');
                // }
                yield newModel_1.default.findByIdAndUpdate(newId, actionInNew, { session: session });
                yield session.commitTransaction();
                session.endSession();
                res.send('ok');
            }
            catch (error) {
                yield session.abortTransaction();
                session.endSession();
                if (error instanceof Error)
                    res.status(500).send(error.message); //TODO: quitar error.message
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const body = req.body;
            const response = yield newModel_1.default.findByIdAndUpdate(id, body);
            res.json(response);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield newModel_1.default.findByIdAndDelete(id);
            res.json(response);
        });
    }
}
exports.default = new NewsCtrl();
//# sourceMappingURL=newsCtrl.js.map