const Joi = require("joi");

const createVisitSchema = Joi.object({
  mobileNumber: Joi.string().min(10).max(15).required(),

  customerName: Joi.string().allow(null, "").optional(),

  email: Joi.string().email().allow(null, "").optional(),

  birthday: Joi.date().allow(null).optional(),

  gender: Joi.string()
    .valid("MALE", "FEMALE", "OTHER")
    .allow(null, "")
    .optional(),

  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().required(),

        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  discountAmount: Joi.number().min(0).default(0),

  taxAmount: Joi.number().min(0).default(0),

  paymentMethod: Joi.string()
    .valid("CASH", "UPI", "CARD", "WALLET", "OTHER")
    .default("UPI"),
});

module.exports = {
  createVisitSchema,
};
