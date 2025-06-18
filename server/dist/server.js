"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const upload_1 = __importDefault(require("./routes/upload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const share_1 = __importDefault(require("./routes/share"));
dotenv_1.default.config();
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
server.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/assets/documents/photo')));
// server.use(cors({ origin: 'http://localhost:5173' , credentials: true}))
server.use(express_1.default.urlencoded({ extended: true }));
server.use((0, cookie_parser_1.default)());
server.use('/api/auth', auth_1.default);
server.use('/api/data', upload_1.default);
server.use('/api/data/share', share_1.default);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = server;
