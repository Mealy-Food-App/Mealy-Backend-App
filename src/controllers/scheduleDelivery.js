import Cart from "../model/cart.model.js";
import { validateDeliveryDate } from "../validator/scheduleDelivery.js";

export default class DeliveryController {
  static async scheduleDelivery(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }

      const { error } = validateDeliveryDate.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid delivery date",
          error: error.details[0].message,
        });
      }

      const { deliveryDate } = req.body;
      const userId = req.user._id;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          status: "failed",
          message: "Cart not found",
        });
      }

      cart.deliveryDate = deliveryDate;

      await cart.save();

      res.status(200).json({
        status: "success",
        message: "Delivery scheduled",
        data: cart,
        deliveryDate: cart.deliveryDate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}
