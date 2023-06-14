import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";

export default class CartController {
  static async addToCart(req, res) {
    try {
      const { userId, productName, quantity } = req.body;

      // Find the product by name
      const product = await Product.findOne({ name: productName });
      if (!product) {
        return res.status(404).json({
          status: "failed",
          message: "Product not found",
        });
      }

      // Find the user's cart
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        // If the cart doesn't exist, create a new cart
        cart = new Cart({ userId, items: [] });
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

      // Save the cart
      await cart.save();

      // Send the cart data and product information back to the client
      res.status(200).json({
        status: "success",
        message: "Product added to cart",
        data: cart,
        productName: product.name,
        price: product.price,
        quantity: quantity,
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}
