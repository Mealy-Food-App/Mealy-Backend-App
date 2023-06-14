import { Schema, model } from "mongoose";

const feedbackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date, user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    default: Date.now,
  },
});

export default model("UserFeedback", feedbackSchema);
