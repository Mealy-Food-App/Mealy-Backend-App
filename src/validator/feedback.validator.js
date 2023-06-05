import Joi from "joi";

export const feedbackValidator = Joi.object({
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .optional()
    .messages({
      "string.pattern.base": "Email is not a valid email format/address",
    }),
  message: Joi.string()
    .required()
    .min(5)
    .regex(/^[a-zA-Z0-9._%+-]/)
    .messages({
      "string.pattern.base": "must be more than 10 words",
    }),
}).strict();
