const express = require("express");

const validate = require("../../common/middlewares/validate.middleware");
const authMiddleware = require("../../common/middlewares/auth.middleware");

const orderController = require("../order/order.controller");

const { createOrderSchema, updateStatusSchema } = require("./order.validation");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(createOrderSchema),
  orderController.createOrder
);

// Get all orders with optional status filter
router.get("/", authMiddleware, orderController.getOrders);

// Pending orders (can keep for backward compatibility)
router.get("/pending", authMiddleware, orderController.getPendingOrders);

router.patch(
  "/:orderId/status",
  authMiddleware,
  validate(updateStatusSchema),
  orderController.updateOrderStatus
);

module.exports = router;
