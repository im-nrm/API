"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import dbconnect  from './config';
const config_1 = __importDefault(require("./config"));
const usersRoutes_1 = __importDefault(require("./users/usersRoutes"));
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
const newsRoutes_1 = __importDefault(require("./news/newsRoutes"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.disable('x-powered-by');
//TODO: check zod to validations
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    const token = req.cookies.access_token;
    let data = null;
    //https://www.youtube.com/watch?v=UqnnhAZxRac
    // min 1:33:00
    req.session = { user: null };
    try {
        data = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_KEY);
        req.session.user = data;
    }
    catch (_a) { }
    next();
});
app.use('', authRoutes_1.default);
app.use('/users', usersRoutes_1.default);
app.use('/news', newsRoutes_1.default);
app.listen(PORT, () => {
    console.log('server up');
});
(0, config_1.default)();
//# sourceMappingURL=index.js.map