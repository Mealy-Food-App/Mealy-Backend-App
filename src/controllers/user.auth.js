// USER AUTH
import User from "../model/user.model.js";
<<<<<<< HEAD
import { createUserValidator, signinUserValidator } from "../validator/user.validator.js"
=======
import {
  createUserValidator,
  signinUserValidator,
} from "../validator/user.validator.js";
>>>>>>> 41cf55198dcfca018a8702a6e97518230c8ec9d4
import { BadUserRequestError } from "../error/error.js";
import { NotFoundError } from "../error/error.js";
import bcrypt from "bcrypt";
import { config } from "../config/index.js";
import nodemailer from "nodemailer"
//import Reset from "../model/reset.model";
import jwt from 'jsonwebtoken';
// const catchAsync = require('../utils/catchAsync.js');

<<<<<<< HEAD


export default class UserController {
  static async signup(req, res) {
    // Joi validation
    const { error, value } = await createUserValidator.validate(req.body)
    if (error) throw error;

    const emailExists = await User.find({ email: req.body.email })
    if (emailExists.length > 0) throw new BadUserRequestError("An account with this email already exists.");
    // const saltRounds = config.bcrypt_salt_round
    // const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    const user = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      // password: hashedPassword
    }

    const newUser = await User.create(user)
    res.status(200).json({
      message: "User created successfully",
      status: "Success",
      data: {
        user: newUser,
        // access_token: generateToken(newUser)
      }
    })
  }


  // login 
  static async signinUser(req, res) {
    const { error } = signinUserValidator.validate(req.body);
    if (error) throw error;
    if (!req.body.email)
      throw new BadUserRequestError("Please provide your email before login");

    const userId = await User.findOne({ email: req.body.email });
    // const hash = bcrypt.compareSync(req.body.password, user.password);
    // if (!hash) throw new BadUserRequestError("email or password is incorrect");
    res.status(200).json({
      message: "Login successfully",
      status: "success",
      data: {
        user,
        // login_token: genToken(user),
      },
    });
  }



  //forgot pssword

  static async forgotPassword(req, res) {
    const { email } = req.body;
    const appEmail = process.env.EMAIL;
    const password = process.env.PASSWORD;


    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


      user.resetToken = token;
      user.expires = Date.now() + 60 * 60 * 1000; // 1 hour expiration time
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: appEmail,
          pass: password
        },
      });
      const mailOptions = {
        from: appEmail,
        to: email,
        subject: 'Reset Password',
        text: `Please click on the following link to reset your password: ${process.env.DEV_MONGODB_CONNECTION_URL}/resetpassword/${token}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Failed to send reset email' });
        }
        console.log('Reset email sent:', info.response);
        return res.status(200).json({ message: 'Reset email sent' });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
=======
export default class UserController {
  static async signup(req, res) {
    // Joi validation
    const { error, value } = await createUserValidator.validate(req.body);
    if (error) throw error;

    const emailExists = await User.find({ email: req.body.email });
    if (emailExists.length > 0)
      throw new BadUserRequestError(
        "An account with this email already exists."
      );
    const saltRounds = config.bcrypt_salt_round
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
>>>>>>> 41cf55198dcfca018a8702a6e97518230c8ec9d4

    const user = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      password: hashedPassword,
      confirmPassword: hashedPassword
    };

<<<<<<< HEAD
  // Reset password
  static async resetPassword(req, res) {
    const { email, password, token } = req.body;

    try {
      const resetToken = await User.findOne({ token });
      if (!resetToken) {
        return res.status(404).json({ message: 'Invalid or expired token' });
      }

      if (resetToken.expires < Date.now()) {
        await resetToken.remove();

        return res.status(400).json({ message: 'Token expired' });
      }

      const user = await User.findOne({ _id: resetToken.userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      // Remove the token from the database
      await resetToken.remove();

      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
=======
    const newUser = await User.create(user);
    res.status(200).json({
      message: "User created successfully",
      status: "Success",
      data: {
        user: newUser,
        // access_token: generateToken(newUser)
      },
    });
  }

  static async findUser(req, res) {
    const user = await User.findOne({ email: req.query?.email });
    if (!user) throw new NotFoundError("User not found");

    res.status(200).json({
      message: "User found successfully",
      status: "Success",
      data: {
        user,
      },
    });
  }

  // login
  static async signinUser(req, res) {
    const { error } = signinUserValidator.validate(req.body);
    if (error) throw error;
    if (!req.body.email)
      throw new BadUserRequestError("Please provide your email before login");

    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new BadUserRequestError("User does not exist");
    const hash = bcrypt.compareSync(req.body.password, user.password);
    if (!hash) throw new BadUserRequestError("email or password is incorrect");
    res.status(200).json({
      message: "Login successfully",
      status: "success",
      data: {
        user,
        // login_token: genToken(user),
      },
    });
  }
}
>>>>>>> 41cf55198dcfca018a8702a6e97518230c8ec9d4
