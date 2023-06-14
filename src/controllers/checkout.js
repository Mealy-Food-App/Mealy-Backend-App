import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";
// import { cartValidator } from "../validator/cart.validation.js";

export default class CheckoutController {

  static async checkout(req, res) {
    if (!req.user) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    try {
      const userId = req.user._id;

      // Find the user's cart
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          status: "failed",
          message: "Cart not found",
        });
      }

      // Validate the cart or perform any necessary checks before proceeding to checkout
      if (!isValidForCheckout(cart)) {
        return res.status(400).json({
          status: "failed",
          message: "Cannot proceed to checkout. Please review your cart or delivery details.",
        });
      }

      // Calculate the total amount of the cart
      let totalAmount = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        totalAmount += product.price * item.quantity;
      }

      // Create a new order
      const order = new Order({
        userId,
        items: cart.items,
        deliveryAddress: cart.deliveryAddress,
        totalAmount,
      });

      // Save the order
      await order.save();

      // Clear the user's cart after successful checkout
      await Cart.deleteOne({ userId });

      // Redirect the user to the payment page with the order ID
      // res.redirect(`/payment?orderId=${order._id}`);
      res.status(200).json({
        status: "success",
        message: "checkout successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}


function isValidForCheckout(cart) {
  // validation logic here
  // For example, check if the cart has at least one item and a valid delivery address
  if (cart.items.length === 0 || !cart.deliveryAddress) {
    return false;
  }

  return true;
}
