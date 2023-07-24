import Joi from "joi";

export const cartValidator = Joi.object({
  productName: Joi.string().required(),
  quantity: Joi.number().required().min(1),
  deliveryAddress: Joi.string().required(),
  couponCode: Joi.string().optional(),
  mealCustomizations: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      options: Joi.array().items(Joi.string()).required(),
    })
  ).optional(),
  userDefinedCustomizations: Joi.string().default(''),
});
