import { BadUserRequestError } from "../error/error.js";
import User from "../model/user.model.js";
import { updateUserValidator } from "../validator/updateUser.validator.js";


export default class UpdateController {
static async updateUser (req, res) {
    const { error } = updateUserValidator.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.message });
    };

    const { id } = req.params;
    const { fullName, email, phoneNumber, deliveryAddress } = (req.body);
  
    try {
      const user = await User.findOneAndUpdate(
        id,
        { fullName, email, phoneNumber, deliveryAddress },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
        // throw new BadUserRequestError ("user does not exist")
      }
      res.status(200).json({
        message: "User profile updated successfully",
        status: "Success",
        data: {
          user,
        },
      });


    //   return res.json({ message: 'User profile updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
