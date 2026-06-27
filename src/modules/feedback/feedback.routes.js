const express = require("express");

const validate = require("../../common/middlewares/validate.middleware");
const authMiddleware = require("../../common/middlewares/auth.middleware");

const feedbackController = require("./feedback.controller");
const { createFeedbackSchema } = require("./feedback.validation");

const router = express.Router();

router.post(
  "/public",
  validate(createFeedbackSchema),
  feedbackController.createFeedback
);

router.get("/", authMiddleware, feedbackController.getFeedbacks);

router.get("/summary", authMiddleware, feedbackController.getFeedbackSummary);

module.exports = router;
