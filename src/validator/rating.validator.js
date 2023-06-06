import Joi from "joi";

export const ratingValidator = Joi.object({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer value for rating.',
        },
      },
}).strict();
