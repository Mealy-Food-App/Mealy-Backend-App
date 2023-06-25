import express from "express";
import Restaurant from "../model/restaurant.model.js";
import { createRestaurantValidator } from "../validator/restaurant.validatiion.js";
import Product from "../model/product.model.js";

const router = express.Router();

// Create a new restaurant
router.post("/create/restaurants", async (req, res) => {
  const { error } = createRestaurantValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const existingRestaurant = await Restaurant.findOne({ name: req.body.name });

  if (existingRestaurant) {
    return res
      .status(409)
      .json({ status: "failed", message: "Restaurant already exists" });
  }

  try {
    const {
      image,
      name,
      description,
      rating,
      distance,
      estimatedDeliveryTime,
    } = req.body;

    const restaurant = new Restaurant({
      image,
      name,
      description,
      rating,
      distance,
      estimatedDeliveryTime,
    });

    await restaurant.save();

    res.status(201).json({
      data: restaurant,
      status: "success",
      message: "Restaurant created successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
});


// Add an existing product to a restaurant
router.post(
  "/restaurants/addProduct/restaurants/:restaurantId/products/:productId",
  async (req, res) => {
    try {
      const { restaurantId, productId } = req.params;

      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if the restaurant has a products array
      if (!restaurant.products) {
        restaurant.products = [];
      }

      // Check if the product is already associated with the restaurant
      const isProductAlreadyAdded = restaurant.products.includes(productId);

      if (isProductAlreadyAdded) {
        return res.status(409).json({
          message: "Product already added to the restaurant",
        });
      }

      restaurant.products.push(productId);

      await restaurant.save();

      res.status(200).json({
        message: "Product added to the restaurant",
        data: product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Remove a product from a restaurant
router.delete("/restaurants/:restaurantId/products/:productId", async (req, res) => {
  try {
    const { restaurantId, productId } = req.params;

    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the product exists in the restaurant's products array
    const productIndex = restaurant.products.findIndex((id) => id.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in the restaurant" });
    }

    // Remove the product from the restaurant's products array
    restaurant.products.splice(productIndex, 1);

    await restaurant.save();

    res.status(200).json({ message: "Product removed from the restaurant" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Get all restaurants
router.get("/list/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      message: "Restaurant retrieved successfully",
      data: restaurants,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
});

export { router };
