import express from "express";
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
import https from "https";

const router = express.Router();

router.get("/payment-methods", userAuthMiddleWare, (req, res) => {
  const paymentMethods = ["debit Card", "bank transfer", "USSD", "cash"];

  res.status(200).json({
    status: "success",
    message: "Available payment methods",
    data: paymentMethods,
  });
});



// paystack payment method
router.get("/payment-methods/paystack", async (req, res) => {

  const params = JSON.stringify({
    "email": req.body.email,
    "amount": req.body.totalAmount,
  });
  console.log(params);

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: "Bearer sk_test_70c5fd48190746819027b06a86c235a0bbe9c7c1",
      "Content-Type": "application/json",
    },
  };

  const reqPaystack = https
    .request(options, (resPaystack) => {
      let data = "";

      resPaystack.on("data", (chunk) => {
        data += chunk;
      });

      resPaystack.on("end", () => {
        res.send(data);
        console.log(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  reqPaystack.write(params);
  reqPaystack.end();
});

export { router };
