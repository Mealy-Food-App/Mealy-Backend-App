import express from "express";
import UserController from '../controllers/user.auth.js';
import { tryCatchHandler } from "../utils/catchAsync.js";
import UpdateController from "../controllers/updateUser.js";
import FeedbackController from "../controllers/feedback.js";
import RatingController from "../controllers/rating.js";
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
import logoutController from "../controllers/logout.js";
import CartController from "../controllers/cart.js";

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
router.put('/updateuser', userAuthMiddleWare, tryCatchHandler (UpdateController.updateUser));

// feedback route
router.post('/feedback', userAuthMiddleWare, tryCatchHandler (FeedbackController.feedBack))

// rating route
router.post('/rating', userAuthMiddleWare, tryCatchHandler (RatingController.ratings))

// logout route
router.get('/logout', logoutController.logOut);

// cart route
router.post('/cart/add', userAuthMiddleWare, CartController.addToCart);

export {router};
