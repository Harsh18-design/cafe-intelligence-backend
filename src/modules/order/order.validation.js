const Joi = require("joi");

const createOrderSchema = Joi.object({
  tableNumber: Joi.string().required(),

  customerName: Joi.string().allow("", null),

  mobileNumber: Joi.string().min(10).max(15).required(),
  note: Joi.string().allow("", null).optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),

  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        note: Joi.string().allow("", null).optional(),
      })
    )
    .min(1)
    .required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "ACCEPTED", "PREPARING", "READY", "COMPLETED", "REJECTED")
    .required(),
});

module.exports = {
  createOrderSchema,
  updateStatusSchema,
};
