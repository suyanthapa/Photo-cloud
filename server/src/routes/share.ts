import { Router } from "express";
import getUserfromAuthToken from "../Middleware/jwtfromUser";
import shareController from "../controller/shareController";
import validate from "../Middleware/validation";
import shareValidation from "../Validation/share";

const sharedRouter = Router();

sharedRouter.post('/sharePhoto', getUserfromAuthToken,  validate(shareValidation.sharePhoto),shareController.sharePhoto);

export default sharedRouter;