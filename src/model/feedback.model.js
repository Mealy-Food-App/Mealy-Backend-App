import { Schema, model } from "mongoose";

const feedbackSchema = new Schema({
  email: {
    type: String,
    require: [false, "please provide an email address"],
    unique: true,
    lowercase: true,
    validator: {
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please add a valid email string to the email path.",
      ],
    },
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default model("UserFeedback", feedbackSchema);
