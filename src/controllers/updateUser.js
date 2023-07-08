import User from "../model/user.model.js";
import { updateUserValidator } from "../validator/updateUser.validator.js";
// import nodemailer from "nodemailer";

export default class UpdateController {
  static async updateUser(req, res) {
    const { error } = updateUserValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const getUser = await User.findOneAndUpdate(
      { email: req.user.email },
      req.body
    );
    const { fullName, email, phoneNumber, deliveryAddress } = req.body;


    //   const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: "mealybackend@gmail.com",
    //       pass
    //         : "cllvzfruzmuvzwai"
    //     },
    //   });
    //   const mailOptions = {
    //     from: "mealybackend@gmail.com",
    //     to: getUser,
    //     subject: 'Account update!!!',
    //     text: `you have successfully updated your account, if you did not make this changes, please reach out to us on mealybackend@gmail.com immediately`,
    //   };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       console.log(error);
    //       return res.status(500).json({ message: 'Failed to send update email' });
    //     }
    //     console.log('Reset email sent:', info.response);
    //     return res.status(200).json({ message: 'update up email sent' });

    //   });


    if (getUser) {
      {
        fullName, email, phoneNumber, deliveryAddress;
      }
      return res.status(400).json({ getUser });
    }

    if (!getUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      message: "User profile updated successfully",
      status: "Success",
      data: {
        getUser,
      },
    });
  }
}
