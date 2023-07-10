import express from "express";
import UserController from '../controllers/user.auth.js';
import { tryCatchHandler } from "../utils/catchAsync.js";
import UpdateController from "../controllers/updateUser.js";
import FeedbackController from "../controllers/feedback.js";
import RatingController from "../controllers/rating.js";
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
import logoutController from "../controllers/logout.js";
import CartController from "../controllers/addCart.js";
import RemoveCartController from "../controllers/removeCart.js";
import DeliveryController from "../controllers/scheduleDelivery.js";
import CheckoutController from "../controllers/checkout.js";
import OrderController from "../controllers/orderHistory.js";
import CouponController from "../controllers/coupon.controller.js";
import RecommendationController from "../controllers/recommendation.js";

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
router.put('/updateuser/:userId', userAuthMiddleWare, tryCatchHandler (UpdateController.updateUser));

// feedback route
router.post('/feedback', userAuthMiddleWare, tryCatchHandler (FeedbackController.feedBack))

// rating route
router.post('/rating', userAuthMiddleWare, tryCatchHandler (RatingController.ratings))

// logout route
router.get('/logout', logoutController.logOut);

// cart route
router.post('/cart/add', userAuthMiddleWare, CartController.addToCart);
router.delete('/cart/remove/:productId', userAuthMiddleWare, RemoveCartController.removeFromCart);

// delivery address route
router.patch('/cart/schedule-delivery', userAuthMiddleWare, DeliveryController.scheduleDelivery);

// order route
router.post('/checkout', userAuthMiddleWare, CheckoutController.checkout);

// order history route
router.get('/orderhistory', userAuthMiddleWare, tryCatchHandler (OrderController.orderHistory));

// coupon routes
router.post('/createCoupons', CouponController.createCoupon);

// recommendation route
router.get("/recommendations/:userId", userAuthMiddleWare, RecommendationController.recommendation);


export {router};
