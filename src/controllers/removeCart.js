import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";
import { cartValidator } from "../validator/cart.validation.js";

export default class RemoveCartController {

  static async removeFromCart(req, res) {
    if (!req.user) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    const { error } = cartValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
        const { productId } = req.params;
        const userId = req.user._id;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          status: "failed",
          message: "Cart not found",
        });
      }

      // Check if the product exists in the cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (!existingItem) {
        return res.status(404).json({
          status: "failed",
          message: "Product not found in cart",
        });
      }

      // Reduce the quantity of the item by 1
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        // If the quantity becomes zero, remove the item from the cart
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }

      let totalAmount = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        totalAmount += product.price * item.quantity;
      }

      await cart.save();

      res.status(200).json({
        status: "success",
        message: "Item quantity reduced in cart",
        data: cart,
        totalAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}
