import express from 'express';
import authController from '../controller/authController';
import userValidation from '../Validation/auth';
import validate from '../Middleware/validation';

const authRouter = express.Router();

authRouter.post('/register', validate(userValidation.register),authController.register);

export default authRouter;


 
 