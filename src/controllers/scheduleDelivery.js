import scheduleDelivery from "../model/cart.model.js";
import Cart from "../model/cart.model.js";

export default class DeliveryController {
  static async scheduleDelivery(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }

      const { deliveryDate } = req.body;
      const userId = req.user._id;

      // Find the user's cart
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          status: "failed",
          message: "Cart not found",
        });
      }

      // Update the delivery date of the cart
      cart.deliveryDate = deliveryDate;

      // Save the updated cart
      await cart.save();

      // Send the updated cart data back to the client
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
