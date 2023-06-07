// USER AUTH
import User from "../model/user.model.js";
import {
  createUserValidator,
  signinUserValidator, passwordEmailValidator, resetPasswordField, verifyCodeValidator
} from "../validator/user.validator.js";
import { BadUserRequestError } from "../error/error.js";
import { NotFoundError } from "../error/error.js";
import bcrypt from "bcrypt";
import { config } from "../config/index.js";
import nodemailer from "nodemailer"
//import Reset from "../model/reset.model";
import jwt from 'jsonwebtoken';
import { genToken } from "../utils/jwt.utils.js";

function generateToken() {
  return Math.floor(10000 + Math.random() * 90000);
}

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

    const { email } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "mealybackend@gmail.com",
        pass
          : "cllvzfruzmuvzwai"
      },
    });
    const mailOptions = {
      from: "mealybackend@gmail.com",
      to: email,
      subject: 'Account created',
      text: `you have successfully sign up with meally app, enjoy your journey with us`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to send sign up email' });
      }
      console.log('Reset email sent:', info.response);
      return res.status(200).json({ message: 'sign up email sent' });

    });

    const saltRounds = config.bcrypt_salt_round
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    const user = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      password: hashedPassword,
    };


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
        login_token: genToken(user),
      },
    });
  }


  //forgot pssword
  static async forgotPassword(req, res) {
    const { error } = passwordEmailValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { email } = req.body;
    //const appEmail = process.env.EMAIL;
    //const password = process.env.PASSWORD;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const token = generateToken().toString()

      user.token = token;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "mealybackend@gmail.com",
          pass
            : "cllvzfruzmuvzwai"
        },
      });
      const mailOptions = {
        from: "mealybackend@gmail.com",
        to: email,
        subject: 'Reset Password',
        text: `Your verification code is: ${token}`,
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


  //confirmtoken
  static async confirmToken(req, res) {
    const { error } = verifyCodeValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { token } = req.body;

    try {
      const userToken = await User.findOne({ token });
      if (!userToken) {
        return res.status(404).json({ message: 'Token is required' });
      }

      if (userToken.expireAt > Date.now()) {

        return res.status(400).json({ message: 'Token expired' });
      }

      return res.status(200).json({ message: 'Token confirmed' });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }


  // Reset password
  static async resetPassword(req, res) {

    const { error } = resetPasswordField.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const saltRounds = config.bcrypt_salt_round
      const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
      user.password = hashedPassword;
      user.confirmPassword = hashedPassword;
      await user.save();

      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
