import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";
import Coupon from "../model/coupon.model.js";
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
      const { productName, quantity, deliveryAddress, couponCode } = req.body;
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
      let cartAmount = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        cartAmount += product.price * item.quantity;
      }

      const deliveryCharge = 700;
      let totalAmount = cartAmount + deliveryCharge;
      let discountAmount = 0;

      let coupon = null;
      if (couponCode) {
        coupon = await Coupon.findOne({ couponCode });

        if (!coupon) {
          return res.status(404).json({
            status: "failed",
            message: "Coupon not found",
          });
        }

        if (!coupon.active) {
          return res.status(400).json({
            status: "failed",
            message: "Coupon is not active",
          });
        }

        if (coupon.expirationDate && coupon.expirationDate < new Date()) {
          return res.status(400).json({
            status: "failed",
            message: "Coupon has expired",
          });
        }

        if (coupon.type === "percentage") {
          discountAmount = (coupon.value / 100) * cartAmount;
          totalAmount -= discountAmount;
        } else if (coupon.type === "fixed") {
          discountAmount = coupon.value;
          totalAmount -= coupon.value;
        }
      }

      cart.cartAmount = cartAmount;
      cart.deliveryCharge = deliveryCharge;
      cart.totalAmount = totalAmount;
      cart.couponCode = couponCode;
      cart.discountAmount = discountAmount;

      await cart.save();

      res.status(200).json({
        status: "success",
        message: "Product added to cart",
        data: cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Server Error" });
    }
  }
}
