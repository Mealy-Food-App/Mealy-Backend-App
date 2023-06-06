import Joi from "joi";

export const feedbackValidator = Joi.object({
  message: Joi.string()
    .required()
    .min(5)
    .regex(/^[a-zA-Z0-9._%+-]/)
    .messages({
      "string.pattern.base": "must be more than 10 words",
    }),
}).strict();
