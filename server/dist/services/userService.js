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
exports.markUserVerified = exports.findUserByEmail = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client = new client_1.PrismaClient();
const createUser = (email, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); //hash the password
    return client.user.create({
        data: {
            username: username,
            password: hashedPassword,
            email: email,
            isEmailVerified: false,
        },
    });
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return client.user.findUnique({
        where: {
            email: email,
        },
    });
});
exports.findUserByEmail = findUserByEmail;
const markUserVerified = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return client.user.update({
        where: { email },
        data: {
            isEmailVerified: true,
        },
    });
});
exports.markUserVerified = markUserVerified;
