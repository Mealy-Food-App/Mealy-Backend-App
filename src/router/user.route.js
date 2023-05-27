import express from "express";
import UserController from '../controllers/user.auth.js';
import { tryCatchHandler } from "../utils/catchAsync.js";
//import ForgotPasswordController from "../controllers/reset.auth.js"

const router = express.Router();
router.post('/signup', tryCatchHandler (UserController.signup));
router.post('/signin', tryCatchHandler (UserController.signinUser));

router.post('/forgotpassword', UserController.forgotPassword);
router.post('/resetpassword', UserController.resetPassword);

export {router};