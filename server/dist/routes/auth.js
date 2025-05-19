"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const auth_1 = __importDefault(require("../Validation/auth"));
const validation_1 = __importDefault(require("../Middleware/validation"));
const authRouter = express_1.default.Router();
//register user
authRouter.post('/register', (0, validation_1.default)(auth_1.default.register), authController_1.default.register);
//Login User
authRouter.post('/login', (0, validation_1.default)(auth_1.default.login), authController_1.default.login);
exports.default = authRouter;
