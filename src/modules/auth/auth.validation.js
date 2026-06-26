const Joi = require("joi");

const registerSchema = Joi.object({
  cafeName: Joi.string().min(2).max(100).required(),

  ownerName: Joi.string().min(2).max(100).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).max(30).required(),

  phoneNumber: Joi.string().min(10).max(15).required(),

  address: Joi.string().min(3).max(300).required(),

  gstNumber: Joi.string().allow(null, "").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
