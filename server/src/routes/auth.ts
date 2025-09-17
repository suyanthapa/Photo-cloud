import express from "express";
import authController from "../controller/authController";
import userValidation from "../Validation/auth";
import validate from "../Middleware/validation";
import getUserfromAuthToken from "../Middleware/jwtfromUser";

const authRouter = express.Router();

//Login User
authRouter.post("/login", validate(userValidation.login), authController.login);

//Login User
authRouter.post("/", validate(userValidation.login), authController.login);

//register user
authRouter.post(
  "/register",
  validate(userValidation.register),
  authController.register
);

//  verify OTP
authRouter.post(
  "/verify-otp",
  validate(userValidation.verifyOTP),
  authController.verifyInputOTP
);

//forgot password --sends otp
authRouter.post(
  "/forgot-password",

  authController.forgotPassword
);

//reset password
authRouter.post(
  "/reset-password",
  validate(userValidation.resetPassword),
  authController.resetPassword
);

//logout

authRouter.post("/logout", getUserfromAuthToken, authController.logout);
export default authRouter;
