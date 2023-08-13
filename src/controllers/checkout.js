import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";
import shortid from "shortid";


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

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          status: "failed",
          message: "Cart not found",
        });
      }

      // Validate the cart for checkout
      if (!isValidForCheckout(cart)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid cart for checkout",
        });
      }

      // Calculate the total amount of the cart
      let cartAmount = 0;
      let customizationPrice = 0;

      for (const item of cart.items) {
        const product = await Product.findById(item.productId);

        // Calculate customization price for each item
        for (const customization of item.mealCustomizations) {
          customizationPrice += customization.price * item.quantity;
        }
        cartAmount += product.price * item.quantity;

      }

      const orderId = "Mealy" + generateOrderId();

      let couponDiscount = cart.couponDiscount;
      const deliveryCharge = cart.deliveryCharge;
      const totalAmount = cartAmount + deliveryCharge - couponDiscount + customizationPrice;

      const order = new Order({
        userId,
        items: cart.items,
        deliveryAddress: cart.deliveryAddress,
        cartAmount: cartAmount + customizationPrice,
        deliveryCharge,
        couponDiscount,
        totalAmount,
        deliveryDate: cart.deliveryDate,
        orderId,
      });

      function generateOrderId() {
        // Generate a unique order ID using UUID
        const orderId = shortid.generate();
        return orderId;
      }

      await order.save();

      // res.redirect("/payment-methods");

      // Clear the user's cart after successful checkout
      // await Cart.deleteOne({ userId });

      res.status(200).json({
        status: "success",
        message: "Checkout successful",
        data: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}

function isValidForCheckout(cart) {
  // Check if the cart has at least one item, a valid delivery address,
  if (
    cart.items.length === 0 ||
    !cart.deliveryAddress 
    // cart.items.some((item) => item.mealCustomizations && item.mealCustomizations.length === 0)
  ) {
    return false;
  }

  return true;
}