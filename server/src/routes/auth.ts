import express from 'express';
import authController from '../controller/authController';
import userValidation from '../Validation/auth';
import validate from '../Middleware/validation';

const authRouter = express.Router();

//register user
authRouter.post('/register', validate(userValidation.register),authController.register);

//Login User
authRouter.post('/login', validate(userValidation.login),authController.login);

export default authRouter;


 
 