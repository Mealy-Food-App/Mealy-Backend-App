import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
    publicId: {
      type: String,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    mealOfTheWeek: {
      type: Boolean,
      required: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    restaurant: {
      type: String,
      ref: "Restaurant",
    },
    mealCustomizations: [
      {
        name: { type: String, required: true },
        options: [{ type: String, required: true }],
      },
    ],
    userDefinedCustomizations: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default model("Product", productSchema);
