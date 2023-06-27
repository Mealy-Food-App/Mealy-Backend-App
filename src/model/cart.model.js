import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    deliveryDate: {
      type: Date,
      ref: "delivery"
    },
    deliveryAddress: {
      type: String
    },
    cartAmount:{
      type: Number,
      required: false,
    },
    deliveryCharge: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

export default model("Cart", cartSchema);
