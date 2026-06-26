const express = require("express");

const healthRoutes = require("./modules/health/health.routes");
const authRoutes = require("./modules/auth/auth.routes");
const customerRoutes = require("./modules/customer/customer.routes");
const visitRoutes = require("./modules/visit/visit.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const menuRoutes = require("./modules/menu/menu.routes");
const orderRoutes = require("./modules/order/order.routes");
const publicRoutes = require("./modules/public/public.routes");
const router = express.Router();

router.use("/health", healthRoutes);

// Future routes
router.use("/auth", authRoutes);
// router.use("/cafes", cafeRoutes);
router.use("/customers", customerRoutes);
router.use("/visits", visitRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/menu", menuRoutes);
router.use("/orders", orderRoutes);
router.use("/public", publicRoutes);

module.exports = router;
