import Joi from "joi";

export const productValidator =  Joi.object({
  name: Joi.string().required(),
  price: Joi.string().required(),
  description: Joi.string(),
  image: Joi.array().items(Joi.string()),
  category: Joi.string().required(),
  mealOfTheDay: Joi.boolean().required(),
  isFeatured: Joi.boolean().default(false),
});

export const categoryValidator = Joi.object({
  name: Joi.string().required(),
  image: Joi.array().items(Joi.string()),
  totalPlaces: Joi.string().required()
});






