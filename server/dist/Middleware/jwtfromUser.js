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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getUserfromAuthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authToken = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        //const authToken = req.header('Authorization')?.replace('Bearer ', '');
        const decode = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
        if (decode) {
            if (typeof decode === "string") {
                res.status(403).json({
                    message: "You are not authorized"
                });
                return;
            }
            req.userId = decode.userId;
            console.log(req.userId);
            next();
        }
        else {
            res.status(403).json({
                message: "You arenot authorized"
            });
        }
    }
    catch (e) {
        if (e instanceof Error) {
            console.error("error:" + e);
            res.status(401).json({
                message: e.message
            });
        }
        else {
            console.error("error" + e);
            res.status(401).json({
                message: e
            });
        }
    }
});
exports.default = getUserfromAuthToken;
