import express from 'express';
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/payment-methods', userAuthMiddleWare, (req, res) => {

    const paymentMethods = ['debit Card', 'bank transfer', 'USSD', 'cash'];

    res.status(200).json({
        status:'success',
        message:"Available payment methods",
        data:paymentMethods
    })
});

export { router };
