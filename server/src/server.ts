
import express from 'express';
import authRouter from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();
const server = express();



server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(authRouter);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

export default server;