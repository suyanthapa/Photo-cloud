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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
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
        const user = yield client.user.create({
            data: {
                email: email,
                username: username,
                password: password,
            },
        });
        console.log("User Created Successfulyy");
        res.status(201).json({
            user,
            message: "User created successfully"
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
const authController = {
    register,
};
exports.default = authController;
