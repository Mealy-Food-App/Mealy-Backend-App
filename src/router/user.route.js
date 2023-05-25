import express from "express";
import UserController from '../controllers/user.auth.js';
import { tryCatchHandler } from "../utils/catchAsync.js";

const router = express.Router();
router.post('/signup', tryCatchHandler (UserController.signup));
router.post('/signin', tryCatchHandler (UserController.signinUser));


export {router};