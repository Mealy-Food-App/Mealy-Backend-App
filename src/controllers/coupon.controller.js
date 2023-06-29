import Coupon from "../model/coupon.model.js";
import { couponValidator } from "../validator/coupon.validator.js";

export default class CouponController {
  static async createCoupon(req, res) {

    const { error } = couponValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
    const { couponCode, type, value, expirationDate } = req.body;

      // Check if the coupon code already exists
      const existingCoupon = await Coupon.findOne({ couponCode });
      if (existingCoupon) {
        return res.status(409).json({
          status: "failed",
          message: "Coupon code already exists",
        });
      }

      const coupon = new Coupon({
        couponCode,
        type,
        value,
        expirationDate,
      });

      await coupon.save();

      res.status(201).json({
        status: "success",
        message: "Coupon created successfully",
        data: coupon,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}
