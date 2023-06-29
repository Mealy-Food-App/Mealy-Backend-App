import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
    },
    value: {
      type: Number,
    },
    expirationDate: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Coupon", couponSchema);
