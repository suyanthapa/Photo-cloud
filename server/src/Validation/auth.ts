import Joi from "joi";

const userValidation ={

    register: {

        body: Joi.object({
            email: Joi.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format',
            }),

            username: Joi.string().min(3).required().messages({
                'any.required': 'Username is required',
                'string.min': 'Username must be at least 3 characters',
            }),

             password: Joi.string().min(6).required().messages({
                'any.required': 'Password is required',
                'string.min': 'Password must be at least 6 characters',
            }),


        })
    }}

    export default userValidation;