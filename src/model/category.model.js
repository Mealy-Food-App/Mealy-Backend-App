import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
    },
  ],
  publicId: {
    type: String,
  },
  totalPlaces: {
    type: String,
    required: true,
  },
  product: [
    {
      type: String,
      ref: "Product",
    },
  ],
});

export default model("Category", categorySchema);
