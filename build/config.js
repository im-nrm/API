"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DB_URL = 'mongodb://localhost:27017/';
const dbconnect = () => {
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connect(DB_URL + 'users', {}).then(() => { console.log('Connexion to DB OK'); }, (err) => { console.log('Connexion to DB FAILED'); });
};
exports.default = dbconnect;
