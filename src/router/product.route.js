import express from "express";
import Product from "../model/product.model.js";
import Category from "../model/category.model.js";
import { productValidator } from "../validator/homepage.validator.js";

//Create Product
const router = express.Router();
router.post("/addProduct", async (req, res) => {
  const { error } = productValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const existingProduct = await Product.findOne({ name: req.body.name });

  if (existingProduct) {
    return res
      .status(409)
      .json({ status: "failed", message: "Product already exists" });
  }

  const categoryName = req.body.category;

  try {
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      res.send("Category does not exist, Create one");
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: category.name, // Use the name field of the category
      isFeatured: req.body.isFeatured,
    });

    await product.save();

    category.product.push(product._id); // Add the product's _id to the category's product array
    await category.save();

    res.status(200).json({
      data: product,
      status: "success",
      message: "Product has been created and added to the category",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "An error occurred while adding the product to the category",
    });
  }
});

//List Products
router.get("/products", async (req, res) => {
  try {
    const productList = await Product.find();

    if (!productList) {
      res.status(404).json({ message: "No products yet" });
    }
    res.status(200).json({
      data: productList,
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

//find a product by name
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    const product = await Product.findOne({ name });

    if (!product) {
      res.status(404).json({ message: "Product not available" });
    }
    res.status(200).json({
      data: product,
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

//update
router.put("/update/:name", (req, res) => {
  const { name } = req.params;

  Product.findOneAndUpdate({ name }, req.body)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ status: "success", message: "product has been updated" });
      }
      return res
        .status(400)
        .json({ status: "failed", message: "product not found" });
    })
    .catch((err) => {
      return res.status(400).json({ status: "failed", error: err });
    });
});

//delete
router.delete("/delete/:name", (req, res) => {
  const { name } = req.params;

  Product.findOneAndRemove({ name }, req.body)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ status: "success", message: "product has been deleted" });
      }
      return res
        .status(400)
        .json({ status: "failed", message: "product not found" });
    })
    .catch((err) => {
      return res.status(400).json({ status: "failed", error: err });
    });
});

export { router };

// add same product to another category
router.post("/addToCategory/:productId", async (req, res) => {
  const { productId } = req.params;
  const categoryName = req.body.category;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found" });
    }

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res
        .status(404)
        .json({ status: "failed", message: "Category not found" });
    }

    // Check if the product is already associated with the category
    if (category.product.includes(productId)) {
      return res.status(409).json({
        status: "failed",
        message: "Product is already in the category",
      });
    }

    // Add the product's ID to the category's product array
    category.product.push(productId);

    await category.save();

    res.status(200).json({
      status: "success",
      message: "Product added to the category",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while adding the product to the category",
    });
  }
});


// delete a product from a specific category
router.delete("/removeFromCategory/:categoryId/:productId", async (req, res) => {
  const { productId, categoryId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ status: "failed", message: "Category not found" });
    }

    // Check if the product is associated with the category
    if (!category.product.includes(productId)) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product is not in the category" });
    }

    // Remove the product's ID from the category's product array
    category.product = category.product.filter(
      (id) => id.toString() !== productId
    );
    await category.save();

    res
      .status(200)
      .json({
        status: "success",
        message: "Product removed from the category",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while removing the product from the category",
    });
  }
});


// Update a product's category
router.put("/updateCategory/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const categoryName = req.body.category;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found" });
    }
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res
        .status(404)
        .json({ status: "failed", message: "Category not found" });
    }
    // Remove the product ID from the old category's product array
    const oldCategory = await Category.findOneAndUpdate(
      { product: product._id },
      { $pull: { product: product._id } }
    );

    category.product.push(product._id);

    // Update the product's category field
    product.category = category.name;

    // Save the updated product and category
    await Promise.all([product.save(), oldCategory.save(), category.save()]);

    return res.status(200).json({
      status: "success",
      message: "Product category updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
});
