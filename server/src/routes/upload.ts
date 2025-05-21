import express from 'express';

import userValidation from '../Validation/auth';
import validate from '../Middleware/validation';
import upload from '../Middleware/multerConfig';
import uploadController from '../controller/uploadController';

const uploadRouter = express.Router();

export const userUpload = upload.fields([
    {name: 'photo', maxCount: 1}
]);


//Upload  User Photo
uploadRouter.post('/upload', userUpload, uploadController.uploadData);

//view uploaded data
uploadRouter.get('viewData', uploadController.viewUploadedData)

export default uploadRouter;


 
 