const Joi = require("joi");

const createFeedbackSchema = Joi.object({
  orderId: Joi.string().required(),
  trackingToken: Joi.string().required(),
  overallRating: Joi.number().min(1).max(5).required(),

  foodRating: Joi.number().min(1).max(5).required(),

  serviceRating: Joi.number().min(1).max(5).required(),

  ambienceRating: Joi.number().min(1).max(5).required(),

  cleanlinessRating: Joi.number().min(1).max(5).required(),

  recommend: Joi.boolean().required(),

  comment: Joi.string().allow("", null).max(500).optional(),
});

module.exports = {
  createFeedbackSchema,
};
