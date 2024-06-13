"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
//import dbconnect  from './config';
const config_1 = __importDefault(require("./config"));
const usersRoutes_1 = __importDefault(require("./users/usersRoutes"));
const loginRoutes_1 = __importDefault(require("./login/loginRoutes"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/users', usersRoutes_1.default);
app.use('/login', loginRoutes_1.default);
app.listen(PORT, () => {
    console.log('server up');
});
(0, config_1.default)();
//# sourceMappingURL=index.js.map