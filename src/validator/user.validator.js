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

// forgot password
export const passwordEmailValidator = Joi.object({
  email: Joi.string()
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .email()
    .messages({
      "string.pattern.base": "Email is not a valid email address",
    }),
});

// export const verifyCodeValidator = Joi.object({
//   resetCode: Joi.string().required().min(5).max(5).messages({
//     // "any.required": "the reset code field cannot be empty",
//     "string.min": "code cannot be less than 5",
//     "string.max": "code cannot be more than 5",
//   }),
// });

export const resetPasswordField = Joi.object({
  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Your password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character. it should be at least 8 characters long",
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Confirm password must be the same as the password",
  }),
});