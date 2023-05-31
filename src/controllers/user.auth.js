// USER AUTH
import User from "../model/user.model.js";
import {
  createUserValidator,
  signinUserValidator,
} from "../validator/user.validator.js";
import { BadUserRequestError } from "../error/error.js";
import { NotFoundError } from "../error/error.js";
import bcrypt from "bcrypt";
import { config } from "../config/index.js";
import nodemailer from "nodemailer"
//import Reset from "../model/reset.model";
import jwt from 'jsonwebtoken';
  
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
          user: "roheemahadebisi@gmail.com",
          pass: "ukfktxvpeltwwiuu"
        },
      });
      const mailOptions = {
        from: "roheemahadebisi@gmail.com",
        to: email,
        subject: 'Reset Password',
        text: `Please click on the following link to reset your password: http://127.0.0.1:5000/api/mealy/user/resetpassword/${token}`,
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

    // Reset password
    static async resetPassword(req, res) {
      const { email, password } = req.body;
  
    try {
        //const user = await User.findOne({ email });
        //if (!resetToken) {
          //return res.status(404).json({ message: 'Invalid or expired token' });
       //// }
  
        //if (resetToken.expires < Date.now()) {
        //  await resetToken.remove();
  
         // return res.status(400).json({ message: 'Token expired' });
        //}
  
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  

        const hashedPassword = await bcrypt.hash(password, 10);
  
  
        user.password = hashedPassword;
        await user.save();
  
    
       // await resetToken.remove();
  
        return res.status(200).json({ message: 'Password reset successful' });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
