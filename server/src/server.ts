
import express from 'express';
import authRouter from './routes/auth';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import sharedRouter from './routes/share';

dotenv.config();
const server = express();



server.use(express.json());
server.use(cors({ origin: 'http://localhost:5173' , credentials: true}))

server.use('/uploads', express.static(path.join(__dirname, '../public/assets/documents/photo')));


// server.use(cors({ origin: 'http://localhost:5173' , credentials: true}))

server.use(express.urlencoded({ extended: true }));
server.use(cookieParser())
server.use('/api/auth', authRouter);

server.use('/api/data',uploadRouter);
server.use('/api/data/share',sharedRouter);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

export default server;