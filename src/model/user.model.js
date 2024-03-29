// USER MODEL
import { Schema, model } from "mongoose";

// name, email, password, passwordConfirm
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "please tell us your name"],
    },
    email: {
      type: String,
      require: [true, "please provide an email address"],
      unique: true,
      lowercase: true,
      validator: {
        match: [
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          "Please add a valid email string to the email path.",
        ],
      },
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    deliveryAddress: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      require: [true, "please enter your email"],
      ref: "User",
    },
    token: {
      type: String,
      expires: "30m",
    },
  },
  {
    timestamps: true,
  }
);

// // This is a pre-middleware on save that happens betweern getting and saving the data to the database.
// userSchema.pre('save', function(next) {
//     if(!this.isModified('password')) return next();
// })

export default model("User", userSchema);
