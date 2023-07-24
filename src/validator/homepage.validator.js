import Joi from "joi";

export const productValidator =  Joi.object({
  name: Joi.string().required(),
  price: Joi.string().required(),
  description: Joi.string(),
  image: Joi.array().items(Joi.string()),
  category: Joi.string().required(),
  mealOfTheWeek: Joi.boolean().optional(),
  isFeatured: Joi.boolean().default(false),
  restaurant: Joi.string().required(),
  mealCustomizations: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      options: Joi.array().items(Joi.string()).required(),
    })
  ),
  userDefinedCustomizations: Joi.string().default(''),
});

export const categoryValidator = Joi.object({
  name: Joi.string().required(),
  image: Joi.array().items(Joi.string()),
  totalPlaces: Joi.string().required()
});






