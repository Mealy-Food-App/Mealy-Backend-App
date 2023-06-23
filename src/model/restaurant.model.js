import { Schema, model } from "mongoose";

const restaurantSchema = new Schema(
  {
    image: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
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
  },
  {
    timestamps: true,
  }
);

export default model("Restaurant", restaurantSchema);
