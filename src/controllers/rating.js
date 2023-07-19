import UserRating from  "../model/rating.model.js"
import { ratingValidator } from "../validator/rating.validator.js";
import User from "../model/user.model.js";


export default class FeedbackController {
  static async ratings(req, res) {
    const { error } = ratingValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { rating } = req.body;

    try {
      const userId = req.user._id;

      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const ratingData = new UserRating({
        user: userId,
        rating,
      });

      await ratingData.save();

      res.status(200).json({
        message: "User rating sent successfully",
        status: "Success",
        data: {
          ratingData,
        },
      });

    } catch (err) {
      console.error("Error saving rating to the database", err);
      res.status(500).json({ error: err.message });
    }
  }
}
