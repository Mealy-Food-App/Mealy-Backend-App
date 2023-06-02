import Joi from "joi";

export const updateUserValidator = Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .optional()
      .messages({
        "string.pattern.base": "Email is not a valid email format/address",
      }),
    password: Joi.string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
      )
      .optional()
      .messages({
        "string.pattern.base":
          "You need one number, one alphanumeric character and one in caps, password be more than 8 characters long",
      }),
      phoneNumber: Joi.string()
      .optional()
      .pattern(/^[0-9]{10}$/)
      .messages({
        "string.pattern.base": "Phone number must consist of 10 digit",
      }),
      deliveryAddress: Joi.string().optional()
  }).strict();