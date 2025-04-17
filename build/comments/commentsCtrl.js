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
const commentModel_1 = __importDefault(require("./commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const newModel_1 = __importDefault(require("../news/newModel"));
class CommentsCtrl {
    constructor() {
    }
    getList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    res.status(400).send({ message: 'No se esta pasando la ID' });
                }
                const response = yield commentModel_1.default.find({}).populate('createdBy', {
                    email: 1,
                    username: 1,
                    profilePhoto: 1
                    //TODO: añadir todos los campos
                }).populate('responsesId').populate('likedBy', {
                    email: 1,
                    username: 1
                });
                res.json(response);
            }
            catch (error) {
                if (error instanceof Error)
                    res.status(500).send(error.message);
            }
        });
    }
    getResponseList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //TODO: get responses
                const response = yield commentModel_1.default.find({}).populate('createdBy', {
                    email: 1,
                    username: 1,
                    profilePhoto: 1
                    //TODO: añadir todos los campos
                }).populate('responsesId').populate('likedBy', {
                    email: 1,
                    username: 1
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
            const { id } = req.params;
            const response = yield commentModel_1.default.findById(id).populate('createdBy', {
                email: 1,
                username: 1,
                profilePhoto: 1
            });
            res.json(response);
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const body = req.body;
                const newComment = new commentModel_1.default(body);
                const saveComment = yield newComment.save({ session });
                //Update de la noticia
                //TODO: ver si se puede hacer generico para reutilizar los comentarios
                yield newModel_1.default.findByIdAndUpdate(newComment.sourceFontId, {
                    $inc: { numComments: 1 },
                    $push: { comments: saveComment._id }
                }, { session });
                // commit de los cambios
                yield session.commitTransaction();
                session.endSession();
                res.send(newComment);
            }
            catch (error) {
                yield session.abortTransaction();
                session.endSession();
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message }); //TODO: no enviar nunca error.message
                }
                else {
                    res.status(500);
                }
            }
        });
    }
    postFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { commentId } = req.params;
            const { important } = req.params; //si es importante se añadira a likedBy
            const body = req.body;
            const response = yield commentModel_1.default.findById(commentId).select({
                numLikes: 1,
                numDislikes: 1
            });
            res.status(500).send('No se ha implementado :S');
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { commentId } = req.params;
            const body = req.body;
            res.status(500).send('Implementadon de update por hacer c:');
            return;
            const response = yield commentModel_1.default.findByIdAndUpdate(commentId, body);
            res.json(response);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const { commentId, id } = req.params;
                const comment = yield commentModel_1.default.findById(commentId).session(session);
                if (!comment) {
                    throw new Error('Comentario no encontrado');
                }
                yield comment.deleteOne({ _id: commentId }).session(session);
                const newModel = yield newModel_1.default.findByIdAndUpdate(id, {
                    $inc: { numComments: -1 },
                    $pull: { comments: commentId }
                }, { session, new: true });
                yield session.commitTransaction();
                session.endSession();
                res.send(newModel);
            }
            catch (error) {
                yield session.abortTransaction();
                session.endSession();
                if (error instanceof ErrorEvent) {
                    res.status(500).send(error.message);
                }
            }
        });
    }
}
exports.default = new CommentsCtrl();
//# sourceMappingURL=commentsCtrl.js.map