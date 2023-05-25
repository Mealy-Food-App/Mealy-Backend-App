// USER AUTH
import User from "../model/user.model.js";
import {createUserValidator, signinUserValidator} from "../validator/user.validator.js"
import { BadUserRequestError } from "../error/error.js";
import bcrypt from "bcrypt"
import { config } from "../config/index.js";
// const catchAsync = require('../utils/catchAsync.js');


export default class UserController {
    static async signup (req, res) {
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

  const user = await User.findOne({ email: req.body.email });
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
};


