import express from "express";
import UserController from '../controllers/user.auth.js';
import { tryCatchHandler } from "../utils/catchAsync.js";
//import ForgotPasswordController from "../controllers/reset.auth.js"



const router = express.Router();
router.post('/signup', tryCatchHandler (UserController.signup));
router.post('/signin', tryCatchHandler (UserController.signinUser));
router.get('/', tryCatchHandler (UserController.findUser));
  

git checkout -- app.js src/config/index.js src/controllers/user.auth.js src/model/user.model.js src/validator/user.validator.j



router.post('/forgotpassword', UserController.forgotPassword);
router.post('/resetpassword', UserController.resetPassword);

export {router};