import Joi from "joi";

const shareValidation =  {

    sharePhoto : {

        body: Joi.object({
            receiverId : Joi.number().required().messages({
                'any.required': 'Receiver Id is required'
            }),

             photoId : Joi.number().required().messages({
                'any.required': 'Photo Id is required'
            })
        })
    }

}
export default shareValidation;