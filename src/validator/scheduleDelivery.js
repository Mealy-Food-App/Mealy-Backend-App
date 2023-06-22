import Joi from "joi";

export const validateDeliveryDate = Joi.object({
  deliveryDate: Joi.date().iso().greater('now').required()
});
