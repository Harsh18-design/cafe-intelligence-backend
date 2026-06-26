const express = require("express");
const Joi = require("joi");

const validate = require("../../common/middlewares/validate.middleware");
const publicController = require("./public.controller");

const router = express.Router();

const publicCreateOrderSchema = Joi.object({
  cafeId: Joi.string().required(),

  tableNumber: Joi.string().required(),

  customerName: Joi.string().allow("", null),

  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid 10-digit mobile number",
      "any.required": "Mobile number is required",
    }),
  items: Joi.array()
    .items(
      Joi.object({
        menuItemId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

router.get("/menu/:cafeId", publicController.getPublicMenu);

router.post(
  "/orders",
  validate(publicCreateOrderSchema),
  publicController.createPublicOrder
);
router.get("/orders/:orderId/status", publicController.getOrderStatus);

module.exports = router;
