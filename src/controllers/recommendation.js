import Order from "../model/order.model.js";
import Product from "../model/product.model.js";

// Route to get user details and recommended products
export default class RecommendationController {
  static async recommendation(req, res) {
    if (!req.user) {
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
    }

    try {
      // aggregation pipeline is used to calculate the popularity of products based on the number of times each product is ordered
      const popularProducts = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: "$items.productId",
            uniqueOrderCount: { $addToSet: "$_id" },
            totalOrders: { $sum: "$items.quantity" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        { $sort: { uniqueOrderCount: -1 } },
        { $limit: 20 }, // Adjust the limit as desired
        {
          $project: {
            _id: 0,
            productId: "$_id",
            totalOrders: 1,
            uniqueOrderCount: { $size: "$uniqueOrderCount" },
            product: "$product",
          },
        },
      ]);

      if (popularProducts.length < 10) {
        const popularProductIds = popularProducts.map((product) => product.productId);
        const popularCategories = await Product.distinct("category", { _id: { $in: popularProductIds } });
        const additionalProducts = await Product.aggregate([
          { $match: { category: { $in: popularCategories }, _id: { $nin: popularProductIds } } },
          { $sample: { size: 50 - popularProducts.length } },
        ]);

        popularProducts.push(...additionalProducts);
      }
      res.status(200).json({
        status: "success",
        message: "Popular products retrieved",
        data: popularProducts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
}

/* 
In this code block, an aggregation pipeline is used to calculate the popularity of products based on the number of unique orders they appear in.

The $unwind stage is used to deconstruct the items array in the Order model, which represents individual products in an order.

The $group stage groups the orders by productId and calculates the total number of orders for each product using the $sum operator. The $addToSet operator is used to add unique order IDs to the uniqueOrderCount array, which will later give us the count of unique orders each product appears in.

The $lookup stage performs a left join with the products collection, matching the _id field from the previous stage with the _id field in the products collection. The matching products are stored in the product field.

The $unwind stage is used again to deconstruct the product array, as the previous $lookup stage creates an array.

The $sort stage is used to sort the products in descending order based on the uniqueOrderCount field.

The $limit stage limits the number of results to 20 (you can adjust this as per your requirement).

The $project stage reshapes the output by excluding the _id field, renaming _id to productId, and keeping the totalOrders, uniqueOrderCount, and product fields.

Finally, the popular products are stored in the popularProducts variable.
*/