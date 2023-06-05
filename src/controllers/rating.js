import UserRating from  "../model/rating.model.js"
import { ratingValidator } from "../validator/rating.validator.js";
// import { BadUserRequestError } from "../error/error.js";

export default class RatingController {
  static async feedBack(req, res) {
    const { error } = feedbackValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const feedUser = await UserFeedback.findOne({ email: req.user.email },req.body);
    console.log(feedUser)
   
    if (feedUser) {
      {message}
    }

    // const { message } = req.body;

    if (!feedUser){
      return res.status(404).json({ error: "User not found" });
    }

    // const feedback = { message };

    res.status(200).json({
      message: "Thank you for your feedback!",
      status: "Success",
      data: {
        feedUser,
      },
    });
  }
}
