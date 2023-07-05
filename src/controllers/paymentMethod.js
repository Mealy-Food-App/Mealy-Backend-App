import express from "express";
import { userAuthMiddleWare } from "../middlewares/auth.middleware.js";
import https from "https";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/payment-methods", userAuthMiddleWare, (req, res) => {

  if (!req.user) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
  
  const paymentMethods = ["debit Card", "bank transfer", "USSD", "cash"];

  res.status(200).json({
    status: "success",
    message: "Available payment methods",
    data: paymentMethods,
  });
});


// paystack payment method
router.post("/payment-methods/paystack/acceptPayment", async (req, res) => {
  try {
    const params = JSON.stringify({
      email: req.body.email,
      amount: req.body.totalAmount * 100,
    });
    //   console.log(params);

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: process.env.PAYSTACKSECRET_KEY,
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});


// verify payment method
router.get("/payment-methods/paystack/verifyPayment", async (req, res) => {
  try {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/verify/:nrpqh0flnb",
      method: "GET",
      headers: {
        Authorization: process.env.PAYSTACKSECRET_KEY,
      },
    };

    https.request(options, (resPaystack) => {
        let data = "";

        resPaystack.on("data", (chunk) => {
          data += chunk;
        });

        resPaystack.on("end", () => {
          console.log(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export { router };
