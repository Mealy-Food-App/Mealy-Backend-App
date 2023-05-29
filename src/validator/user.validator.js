import Joi from "joi";

export const createUserValidator = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base": "Email is not a valid email format/address",
    }),
  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "You need one number, one alphanumeric character and one in caps, password be more than 8 characters long",
    }),
}).strict();


// login validator
export const signinUserValidator = Joi.object({
  email: Joi.string()
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .required()
  .messages({
    "string.pattern.base": "Email is not a valid email address",
  }),
password: Joi.string().required(),
}).strict();