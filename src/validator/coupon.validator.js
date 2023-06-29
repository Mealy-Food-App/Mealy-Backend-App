import Joi from "joi";

export const couponValidator = Joi.object({
  couponCode: Joi.string().required(),
  type: Joi.string().required(),
  value: Joi.number().required(),
  expirationDate: Joi.date().required(),
});
