import User from "../model/user.model.js";
import { updateUserValidator } from "../validator/updateUser.validator.js";
import nodemailer from "nodemailer";

export default class UpdateController {
  static async updateUser(req, res) {
    const { error } = updateUserValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const { userId } = req.params;
      const { fullName, email, phoneNumber, deliveryAddress } = req.body;

      const updatedFields = {};

      if (fullName) {
        updatedFields.fullName = fullName;
      }
      if (email) {
        updatedFields.email = email;
      }
      if (phoneNumber) {
        updatedFields.phoneNumber = phoneNumber;
      }
      if (deliveryAddress) {
        updatedFields.deliveryAddress = deliveryAddress;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          status: "Failed",
          message: "User not found",
        });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "mealybackend@gmail.com",
          pass
            : "cllvzfruzmuvzwai"
        },
      });

      const updatedFieldsText = Object.keys(updatedFields).map(
        (key) => `${key}: ${updatedFields[key]}`
      );

      const mailOptions = {
        from: "mealybackend@gmail.com",
        to: updatedUser.email,
        subject: 'Account update!!!',
        text: `Your user profile has been updated successfully. \n\n\n Changes: \n${updatedFieldsText.join(", ")}. \n\n\n if you did not make this changes, please reach out to us on mealybackend@gmail.com immediately`,
      };
      //   text: `Your user profile has been updated successfully, if you did not make this changes, please reach out to us on mealybackend@gmail.com immediately`,
      // };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Failed to send update profile' });
        }
        console.log('Update email sent:', info.response);
        return res.status(200).json({ message: 'update up email sent' });

      });

      res.status(200).json({
        message: "User profile updated successfully",
        status: "Success",
        data: {
          updatedUser,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "An error occurred while updating the user's profile",
      });
    }
  }
}
