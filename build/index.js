"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./config"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const HTTP_PORT = 80;
const HTTPS_PORT = 443;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    console.log('get /');
    res.send('get /');
});
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/users', usersRoutes_1.default);
app.listen(HTTPS_PORT, () => {
    console.log('server up');
});
(0, config_1.default)();
