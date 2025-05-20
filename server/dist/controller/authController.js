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
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new client_1.PrismaClient();
dotenv_1.default.config(); // Load .env varia
//regiser
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        const existingusers = yield client.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingusers) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        //create new user
        const user = yield client.user.create({
            data: {
                email: email,
                username: username,
                password: password,
            },
        });
        res.status(201).json({
            user,
            message: "New User created successfully"
        });
        return;
    }
    catch (e) {
        console.error("Register error:", e);
        if (e instanceof Error) {
            res.status(500).json({ message: e.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
//login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //check user exists or not
    const exisitingUser = yield client.user.findFirst({
        where: {
            email: email,
            password: password
        }
    });
    if (!exisitingUser) {
        res.status(200).json({
            message: "Invalid Login Credentials"
        });
        return;
    }
    //generate token
    const token = jsonwebtoken_1.default.sign({
        userId: exisitingUser.id
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("The token is ", token);
    res.status(201).json({
        token,
        message: "User Logged In "
    });
});
const authController = {
    register,
    login
};
exports.default = authController;
