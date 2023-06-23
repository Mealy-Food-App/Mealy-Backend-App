import express from "express";
import Restaurant from "../model/restaurant.model.js";
import { createRestaurantValidator } from "../validator/restaurant.validatiion.js";

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

export { router };
