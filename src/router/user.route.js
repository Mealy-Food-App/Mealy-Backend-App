import express from "express";
import UserController from '../controllers/user.auth.js';
import { tryCatchHandler } from "../utils/catchAsync.js";
// import UserUpdate from "../controllers/updateUser.js";
import UpdateController from "../controllers/updateUser.js";
// import ForgotPasswordController from "../controllers/reset.auth.js"


const router = express.Router();

// user sign up/ sign in route
router.post('/signup', tryCatchHandler (UserController.signup));
router.post('/signin', tryCatchHandler (UserController.signinUser));
router.get('/', tryCatchHandler (UserController.findUser));

// password reset route
router.post('/forgotpassword', UserController.forgotPassword);
router.post('/confirmtoken', UserController.confirmToken);
router.post('/resetpassword', UserController.resetPassword);

// user update route
router.put('/updateuser', UpdateController.updateUser);


export {router};