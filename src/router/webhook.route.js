import express from 'express';
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";


import { handleSuccessfulPayment, handleCanceledPayment } from '../controllers/webhooks.controller.js';

const router = express.Router();

router.post('/payment-success', userAuthMiddleWare, handleSuccessfulPayment);
router.post('/payment-canceled', userAuthMiddleWare, handleCanceledPayment);

export {router};
