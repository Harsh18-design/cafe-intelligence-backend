const express = require("express");

const authMiddleware = require("../../common/middlewares/auth.middleware");
const validate = require("../../common/middlewares/validate.middleware");
const customerController = require("./customer.controller");
const { customerSearchSchema } = require("./customer.validation");

const router = express.Router();

router.post(
  "/search",
  authMiddleware,
  validate(customerSearchSchema),
  customerController.searchCustomer
);

router.get(
  "/:customerId",
  authMiddleware,
  customerController.getCustomerDetails
);

module.exports = router;
