import UserFeedback from "../model/feedback.model.js";
import { feedbackValidator } from "../validator/feedback.validator.js";
// import { NotFoundError } from "../error/error.js";
import User from "../model/user.model.js";

export default class FeedbackController {
  static async feedBack(req, res) {
    const { error } = feedbackValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { message } = req.body;

    try {
      const userId = req.user._id;

      // Check if the user exists in the database
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const FeedbackData = new UserFeedback({
        fullName: req.user.fullName,
        email: req.user.email,
        user: userId,
        message,
      });

      await FeedbackData.save();

      res.status(200).json({
        message: "User feeback sent successfully",
        status: "Success",
        data: {
          FeedbackData,
        },
      });

    } catch (err) {
      console.error("Error saving feedback to the database", err);
      res.status(500).json({ error: err.message });
    }
  }
}
