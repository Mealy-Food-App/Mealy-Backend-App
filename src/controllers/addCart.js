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
      const { productName, quantity, deliveryAddress, couponCode, mealCustomizations } = req.body;
      const userId = req.user._id;

      const product = await Product.findOne({ name: productName });
      if (!product) {
        return res.status(404).json({
          status: "failed",
          message: "Product not found",
        });
      }

      // Calculate the total customization price
      let customizationPrice = 0;
      if (mealCustomizations && mealCustomizations.length > 0) {
        for (const customization of mealCustomizations) {
          const selectedOption = product.mealCustomizations.find(option => option.name === customization.name);
          if (selectedOption) {
            const selectedPriceOption = selectedOption.options.find(option => option.nameOption === customization.option);
            if (selectedPriceOption) {
              customizationPrice += selectedPriceOption.priceOption;
            }
          }
        }
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [], deliveryAddress });
      } else {
        cart.deliveryAddress = deliveryAddress;
      }

      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === product._id.toString()
      );

      if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].mealCustomizations = mealCustomizations || [];
      } else {
        cart.items.push({
          productId: product._id,
          quantity,
          mealCustomizations: mealCustomizations || [],
        });
      }

      let cartAmount = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        const productPrice = parseFloat(product.price);
        const itemCustomizationPrice = item.mealCustomizations.reduce(
          (totalPrice, customization) => {
            const selectedOption = product.mealCustomizations.find(
              (option) => option.name === customization.name
            );
            if (selectedOption) {
              const selectedPriceOption = selectedOption.options.find(
                (option) => option.nameOption === customization.option
              );
              if (selectedPriceOption) {
                totalPrice += selectedPriceOption.priceOption;
              }
            }
            return totalPrice;
          },
          0
        );
        cartAmount += (productPrice + itemCustomizationPrice) * item.quantity;
      }

      const deliveryCharge = 700;
      let totalAmount = cartAmount + deliveryCharge;
      let couponDiscount = 0;

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
          couponDiscount = (coupon.value / 100) * cartAmount;
          totalAmount -= couponDiscount;
        } else if (coupon.type === "fixed") {
          couponDiscount = coupon.value;
          totalAmount -= coupon.value;
        }
      }

      cart.cartAmount = cartAmount;
      cart.deliveryCharge = deliveryCharge;
      cart.totalAmount = totalAmount;
      cart.couponCode = couponCode;
      cart.couponDiscount = couponDiscount;

      await cart.save();

      res.status(200).json({
        status: "success",
        message: "Product added to cart",
        data: cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal Server Error" });
    }
  }
}