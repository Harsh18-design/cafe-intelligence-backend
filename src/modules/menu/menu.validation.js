const Joi = require("joi");

const createMenuItemSchema = Joi.object({
  itemCode: Joi.string().allow(null, "").optional(),

  itemName: Joi.string().min(2).max(100).required(),

  category: Joi.string().allow(null, "").optional(),

  price: Joi.number().min(0).required(),

  costPrice: Joi.number().min(0).allow(null).optional(),

  isActive: Joi.boolean().optional(),

  description: Joi.string().allow(null, "").optional(),
});

const updateMenuItemSchema = Joi.object({
  itemCode: Joi.string().allow(null, "").optional(),

  itemName: Joi.string().min(2).max(100).optional(),

  category: Joi.string().allow(null, "").optional(),

  price: Joi.number().min(0).optional(),

  costPrice: Joi.number().min(0).allow(null).optional(),

  isActive: Joi.boolean().optional(),

  description: Joi.string().allow(null, "").optional(),
});

module.exports = {
  createMenuItemSchema,
  updateMenuItemSchema,
};
