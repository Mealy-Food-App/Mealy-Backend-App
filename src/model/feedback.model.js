import { Schema, model } from "mongoose";

const feedbackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  fullName: {
    type: String,
    required: [false, "please tell us your name"],
    ref: "User",
  },
  // email: {
  //   type: String,
  //   require: [false, "please provide an email address"],
  //   unique: false,
  //   lowercase: true,
  // },
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
