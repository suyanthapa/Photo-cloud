import express from "express";
import authController from "../controller/authController";
import userValidation from "../Validation/auth";
import validate from "../Middleware/validation";
import getUserfromAuthToken from "../Middleware/jwtfromUser";
import rateLimit from "express-rate-limit";
import {
  authLimiter,
  generalLimiter,
  otpLimiter,
} from "../Middleware/rateLimiter";

const authRouter = express.Router();

//Login User
authRouter.post(
  "/login",
  authLimiter,
  validate(userValidation.login),
  authController.login
);

//Login User
authRouter.post(
  "/",
  authLimiter,
  validate(userValidation.login),
  authController.login
);

//register user
authRouter.post(
  "/register",
  generalLimiter,
  validate(userValidation.register),
  authController.register
);

//  verify OTP
authRouter.post(
  "/verify-otp",
  authLimiter,
  validate(userValidation.verifyOTP),
  authController.verifyInputOTP
);

//forgot password --sends otp
authRouter.post("/forgot-password", otpLimiter, authController.forgotPassword);

//reset password
authRouter.post(
  "/reset-password",
  validate(userValidation.resetPassword),
  authController.resetPassword
);

//logout
authRouter.post("/logout", getUserfromAuthToken, authController.logout);

//reset password
authRouter.post(
  "/update-password",
  getUserfromAuthToken,
  validate(userValidation.updatePassword),
  authController.updatePassword
);

//view profile
authRouter.get(
  "/me",
  getUserfromAuthToken,

  authController.me
);
export default authRouter;
