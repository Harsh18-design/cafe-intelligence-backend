const express = require("express");

const router = express.Router();

const analyticsController = require("./analytics.controller");

const authMiddleware = require("../../common/middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/top-items", analyticsController.getTopSellingItems);

module.exports = router;
