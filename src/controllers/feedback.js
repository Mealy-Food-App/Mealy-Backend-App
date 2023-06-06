// import UserFeedback from "../model/feedback.model.js";
import { feedbackValidator } from "../validator/feedback.validator.js";
import { NotFoundError } from "../error/error.js";
import User from "../model/user.model.js";

export default class FeedbackController {
  static async feedBack(req, res) {
    const { error } = feedbackValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // const user = req.user.email;
    const { email, message } = req.body;

    try {
      const user = await User.findOne({email});
      
      if (!user) {
        // throw new NotFoundError('user does not exist')
        return res.status(404).send("User does not exist");
      }

      const feedback = new User({
        user: user._email,
        message,
      });

      await feedback.save();

      // res.send("Thank you for your feedback!");
      res.status(200).json({
        message: "User profile updated successfully",
        status: "Success",
        data: {
          feedback,
        },
      });
    } catch (err) {
      console.error("Error saving feedback to the database", err);
      res.status(500).send("Internal server error");
    }
  }
}
