import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    publicId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    distance: {
      type: Number,
      required: false,
    },
    estimatedDeliveryTime: {
      type: Number,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    topDeals: [
      {
        type: String,
        enum: ["free-delivery", "discount", "coupon", "black-friday"],
      },
    ],
    location: [
      {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Restaurant", restaurantSchema);
