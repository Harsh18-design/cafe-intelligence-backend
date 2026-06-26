const Joi = require("joi");

const customerSearchSchema = Joi.object({
  mobileNumber: Joi.string().min(10).max(15).required(),
});

module.exports = {
  customerSearchSchema,
};
