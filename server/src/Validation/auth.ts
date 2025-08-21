import Joi from "joi";

const userValidation = {
  register: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
      }),

      username: Joi.string().min(3).required().messages({
        "any.required": "Username is required",
        "string.min": "Username must be at least 3 characters",
      }),

      password: Joi.string().min(6).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 6 characters",
      }),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
      }),

      password: Joi.string().min(6).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 6 characters",
      }),
    }),
  },

  verifyOTP: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
      }),

      otp: Joi.string().min(6).max(6).required().messages({
        "any.required": "OTP is required",
        "string.min": "OTP must be at least 6 characters",
      }),
    }),
  },

  resetPassword: {
    body: Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Invalid email format",
      }),

      password: Joi.string().min(6).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at least 6 characters",
      }),
      confirmPassword: Joi.string().min(6).required().messages({
        "any.required": "Confirm Password is required",
        "string.min": "Confirm Password must be at least 6 characters",
      }),
    }),
  },
};

export default userValidation;
