import express from "express";
import authController from "../controller/authController";
import userValidation from "../Validation/auth";
import validate from "../Middleware/validation";

const authRouter = express.Router();

// Step 1: send OTP to email
authRouter.post(
  "/send-register-otp",
  validate(userValidation.register),
  authController.sendRegisterOtp
);

// Step 2: verify OTP
authRouter.post("/verify-register-otp", authController.verifyRegisterOtp);

//register user
authRouter.post(
  "/register",
  validate(userValidation.register),
  authController.register
);

//Login User
authRouter.post("/login", validate(userValidation.login), authController.login);

//Login User
authRouter.post("/", validate(userValidation.login), authController.login);

//forgot password
authRouter.post(
  "/forgot-password",

  authController.forgotPassword
);

authRouter.post(
  "/verify-forgot-password-otp",
  authController.verifyForgotPasswordOtp
);

authRouter.post("/reset-password", authController.resetPassword);
export default authRouter;
