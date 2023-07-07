import express, { response } from "express";
import Restaurant from "../model/restaurant.model.js";
import { createRestaurantValidator } from "../validator/restaurant.validatiion.js";
import Product from "../model/product.model.js";
import upload from "../middlewares/upload.js";
import {
  uploadToCloudinary,
  removeFromCloudinary,
} from "../service/cloudinary.js";

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
      specialty,
      rating,
      distance,
      topDeals,
      estimatedDeliveryTime,
    } = req.body;

    const restaurant = new Restaurant({
      image,
      name,
      description,
      specialty,
      rating,
      distance,
      topDeals,
      estimatedDeliveryTime,
    });

    await restaurant.save();

    res.status(201).json({
      status: "success",
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
});

// Upload restaurant Image
router.post(
  "/restaurant/image/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const data = await uploadToCloudinary(
        req.file.path,
        "mealyRestaurant-images"
      );

      if (!data) {
        return res.status(400).json({
          status: "failed",
          message: "An error occurred while uploading the image",
        });
      }

      const savedImg = await Restaurant.updateOne(
        { _id: req.params.id },
        {
          $set: {
            image: data.image,
            publicId: data.public_id,
          },
        }
      );

      res.status(200).json({
        data: data,
        status: "success",
        message: "restaurant image uploaded with success!",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
);

// Delete restaurant Image
router.delete("/restaurant/image/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id });

    const publicId = restaurant.publicId;

    await removeFromCloudinary(publicId);

    const deleteImg = await Restaurant.updateOne(
      { _id: req.params.id },
      {
        $set: {
          image: "",
          publicId: "",
        },
      }
    );
    res.status(200).json({
      data: restaurant,
      status: "success",
      message: "restaurant image deleted with success!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
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
        status: "Success",
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
router.delete(
  "/restaurants/:restaurantId/products/:productId",
  async (req, res) => {
    try {
      const { restaurantId, productId } = req.params;

      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Check if the product exists in the restaurant's products array
      const productIndex = restaurant.products.findIndex(
        (id) => id.toString() === productId
      );

      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: "Product not found in the restaurant" });
      }

      // Remove the product from the restaurant's products array
      restaurant.products.splice(productIndex, 1);

      await restaurant.save();

      res.status(200).json({
        status: "Success",
        message: "Product removed from the restaurant",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


// Get all restaurants
router.get("/list/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      status: "success",
      message: "Restaurant retrieved successfully",
      data: restaurants,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
});


// Get a list of products from a restaurant
router.get("/restaurants/:restaurantId/products", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId).populate(
      "products"
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Retrieved Products of the restaurant successfully",
      data: restaurant.products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get a specific restaurant by ID
router.get("/list/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res
        .status(404)
        .json({ status: "failed", message: "Restaurant not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Restaurant retrieved successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
});


// update a restaurant
router.put("/update/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRestaurant = req.body;

    const existingRestaurant = await Restaurant.findById(id);

    if (!existingRestaurant) {
      return res
        .status(404)
        .json({ status: "failed", message: "Restaurant not found" });
    }

    Object.assign(existingRestaurant, updatedRestaurant);

    const validationResult = existingRestaurant.validateSync();

    if (validationResult) {
      const errorMessages = Object.values(validationResult.errors).map(
        (error) => error.message
      );
      return res.status(400).json({ status: "failed", message: errorMessages });
    }

    const savedRestaurant = await existingRestaurant.save();

    res.status(200).json({
      status: "success",
      message: "Restaurant updated successfully",
      data: savedRestaurant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// delete a restaurant
router.delete("/delete/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByIdAndDelete(id);

    if (!restaurant) {
      return res.status(404).json({
        status: "failed",
        message: "Restaurant not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
});


// add top deals to a restaurant
router.post("/restaurants/:id/top-deals", async (req, res) => {
  const { id } = req.params;
  const { topDeals } = req.body;

  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        status: "failed",
        message: "Restaurant not found",
      });
    }

    const existingDeals = restaurant.topDeals.filter((deal) =>
      topDeals.includes(deal)
    );
    if (existingDeals.length > 0) {
      return res.status(400).json({
        status: "failed",
        message: "One or more top deals already exist",
      });
    }
    
    restaurant.topDeals = topDeals;
    await restaurant.save();

    res.status(200).json({
      status: "success",
      message: "Top deals added successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to add top deals" });
  }
});


// delete top deals from a restaurant
router.delete("/restaurants/:id/top-deals/:deal", async (req, res) => {
  const { id, deal } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        status: "failed",
        message: "Restaurant not found",
      });
    }

    const checkDeal = restaurant.topDeals.indexOf(deal);
    if (checkDeal === -1) {
      return res.status(404).json({
        status: "failed",
        message: "Top deals not found",
      })
    }

    restaurant.topDeals.splice(checkDeal, 1);
    await restaurant.save();

    res.status(200).json({
      status: "success",
      message: "Top deal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete top deal" });
  }
});


// view the available top deals for a single restaurant
router.get("/restaurants/:id/top-deals", async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        status: "failed",
        message: "Restaurant not found",
      });
    }

    const topDeals = restaurant.topDeals;

    res.status(200).json({
      status: "success",
      data: {
        topDeals,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// get list of restaurans with deals.
router.get("/restaurants/top-deals", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      "topDeals.0": { $exists: true },
    });
    res.status(200).json({
      status: "success",
      data: restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export { router };
