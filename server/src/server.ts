import express from "express";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload";

import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import sharedRouter from "./routes/share";
import notificationRouter from "./routes/notification";

import { Server as IOServer } from "socket.io";

import { errorHandler, notFoundHandler } from "./Middleware/errorHandler";
import Redis from "ioredis";

dotenv.config();
const server = express();

server.set("trust proxy", 1);

// ===== CORS Configuration (Centralized) =====
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://photo-cloud-delta.vercel.app",
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

// Apply CORS to Express
server.use(cors(corsOptions));

// ===== HTTP + Socket.IO =====
const httpServer = http.createServer(server);
export const io = new IOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`User connected: ${userId}`);

  if (userId) socket.join(userId as string);
});

// ===== Redis pub-sub =====
// Redis pub-sub for notification (worker publishes to 'notification:pub')
const sub = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
sub.subscribe("notification:pub");
sub.on("message", (channel, message) => {
  const { userId, notification } = JSON.parse(message);
  io.to(userId.toString()).emit("notification", notification);
});

// ===== Middleware =====
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/assets/documents/photo"))
);

// ===== Routes =====
server.use("/api/auth", authRouter);
server.use("/api/data", uploadRouter);
server.use("/api/data/share", sharedRouter);
server.use("/api/notifications", notificationRouter);

// ===== Error Handling =====
server.use(notFoundHandler);
server.use(errorHandler);

// ===== Start server =====
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default server;
