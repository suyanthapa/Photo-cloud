import Joi from "joi";

const shareValidation =  {

    sharePhoto : {

        body: Joi.object({
            receiverEmail: Joi.string().email().required().messages({
              'any.required': 'Email is required',
               'string.email': 'Invalid email format',
             }),

             photoId : Joi.number().required().messages({
                'any.required': 'Photo Id is required'
            })
        })
    }

}
export default shareValidation;