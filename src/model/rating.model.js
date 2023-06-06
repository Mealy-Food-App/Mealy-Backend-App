import { Schema, model } from "mongoose";

const ratingSchema = new Schema({
rating: {
  type: Number,
  required: true,
  min: 1,
  max: 5,
},
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default model("UserRating", ratingSchema);
