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
        name: {
          type: String,
          required: false,
        },
        options: [
          {
            nameOption: {
              type: String,
              required: false,
            },
            priceOption: {
              type: Number,
              required: false,
            },
          },
        ],
      },
    ],
    userDefinedCustomizations: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Product", productSchema);
