const express = require("express");

const authMiddleware = require("../../common/middlewares/auth.middleware");
const dashboardController = require("./dashboard.controller");

const router = express.Router();

router.get("/summary", authMiddleware, dashboardController.getDashboardSummary);
router.get(
  "/revenue-trend",
  authMiddleware,
  dashboardController.getRevenueTrend
);
router.get(
  "/customer-growth",
  authMiddleware,
  dashboardController.getCustomerGrowth
);

router.get(
  "/top-customers",
  authMiddleware,
  dashboardController.getTopCustomers
);

router.get(
  "/recent-visits",
  authMiddleware,
  dashboardController.getRecentVisits
);

module.exports = router;
