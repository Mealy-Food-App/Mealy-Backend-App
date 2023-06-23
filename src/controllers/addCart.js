import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";
import { cartValidator } from "../validator/cart.validation.js";

export default class CartController {
  static async addToCart(req, res) {
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
      const { productName, quantity, deliveryAddress } = req.body;
      const userId = req.user._id;

      const product = await Product.findOne({ name: productName });
      if (!product) {
        return res.status(404).json({
          status: "failed",
          message: "Product not found",
        });
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [], deliveryAddress });
      } else {
        // If the cart already exists, update the delivery address
        cart.deliveryAddress = deliveryAddress;
      }

      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === product._id.toString()
      );

      if (existingItemIndex !== -1) {
        // If the product exists, update the quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.items.push({
          productId: product._id,
          quantity,
        });
      }

      // Calculate the total amount of the cart
      let totalAmount = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        totalAmount += product.price * item.quantity;
      }

      await cart.save();

      res.status(200).json({
        status: "success",
        message: "Product added to cart",
        data: cart,
        totalAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}
