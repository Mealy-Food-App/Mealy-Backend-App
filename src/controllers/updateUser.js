// import { BadUserRequestError } from "../error/error.js";
import User from "../model/user.model.js";
import { updateUserValidator } from "../validator/updateUser.validator.js";

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

    if (getUser) {
      {
        fullName, email, phoneNumber, deliveryAddress;
      }
      return res.status(400).json({ getUser });
    }

    if (!getUser) {
      return res.status(404).json({ error: "User not found" });
      // throw new BadUserRequestError ("user does not exist")
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
