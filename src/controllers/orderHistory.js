import Order from "../model/order.model.js";

export default class OrderController {
  static async orderHistory(req, res) {
    if (!req.user) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    try {
      const userId = req.user._id;

      const orders = await Order.find({ userId })
        .populate("items.productId") // Populate the product details
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: "success",
        message: "Order history retrieved",
        data: orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}
