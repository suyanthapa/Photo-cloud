import express from 'express';

import userValidation from '../Validation/auth';
import validate from '../Middleware/validation';
import upload from '../Middleware/multerConfig';
import uploadController from '../controller/uploadController';
import getUserfromAuthToken from '../Middleware/jwtfromUser';

const uploadRouter = express.Router();

export const userUpload = upload.fields([
    {name: 'photo', maxCount: 1}
]);


//Upload  User Photo
uploadRouter.post('/upload', userUpload,getUserfromAuthToken, uploadController.uploadData);

//view uploaded data
uploadRouter.get('/viewData', getUserfromAuthToken,uploadController.viewUploadedData);

//view uploaded single data
uploadRouter.get('/viewSingleData/:id', getUserfromAuthToken,uploadController.viewSingleData);

//edit uploaded data
uploadRouter.put('/editData', getUserfromAuthToken,uploadController.editData);


//delete uploaded data
uploadRouter.delete('/deleteData', getUserfromAuthToken,uploadController.deleteData);





export default uploadRouter;


 
 