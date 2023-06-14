import Joi from "joi";

export const ratingValidator = Joi.object({
    rating: Joi.string()
    .required()
    .min(1)
    .max(5)
    .regex(/^[a-zA-Z0-9._%+-]/)
    .messages({
      "string.pattern.base": "must not be more than 5",
    }),
}).strict();
