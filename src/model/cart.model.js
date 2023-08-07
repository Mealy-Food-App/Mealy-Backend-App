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
        mealCustomizations: [
          {
            name: {
              type: String,
              required: false,
            },
            option: {
              type: String,
              required: false,
            },
            price: {
              type: Number,
              required: false,
            },
          },
        ],
        userDefinedCustomizations: {
          type: String,
          default: "",
        },
      },
    ],
    deliveryDate: {
      type: Date,
      ref: "delivery",
    },
    deliveryAddress: {
      type: String,
    },
    couponCode: {
      type: String,
      required: false,
    },
    cartAmount: {
      type: Number,
      required: false,
    },
    deliveryCharge: {
      type: Number,
      required: false,
    },
    couponDiscount: {
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
