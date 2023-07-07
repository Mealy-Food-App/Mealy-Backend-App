import Joi from "joi";

// Validation rules for creating a restaurant
export const createRestaurantValidator = Joi.object({
  image: Joi.string().required().messages({
    'any.required': 'Image is required',
    'string.empty': 'Image is required',
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name is required',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description is required',
  }),
  specialty: Joi.string().required().messages({
    'any.required': 'Specialty is required',
    'string.empty': 'SPecialty is required',
  }),
  rating: Joi.number().required().min(1).max(5).messages({
    'any.required': 'Rating is required',
    'number.base': 'Rating must be a number and not less than 1 and more than 5',
  }),
  distance: Joi.number().required().messages({
    'any.required': 'Distance is required',
    'number.base': 'Distance must be a number',
  }),
  estimatedDeliveryTime: Joi.string().required().messages({
    'any.required': 'Estimated delivery time is required',
    'string.empty': 'Estimated delivery time is required',
  }),
  topDeals: Joi.string().valid("free-delivery", "discount", "coupon", "black-friday").optional().messages({
    'any.only': 'Invalid top deal value',
  }),
});
