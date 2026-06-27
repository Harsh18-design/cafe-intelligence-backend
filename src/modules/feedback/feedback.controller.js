const asyncHandler = require("../../common/utils/async-handler.util");
const { successResponse } = require("../../common/helpers/response.helper");

const feedbackService = require("./feedback.service");

const createFeedback = asyncHandler(async (req, res) => {
  const result = await feedbackService.createFeedback(req.body);

  return successResponse(res, "Feedback submitted successfully", result, 201);
});

const getFeedbacks = asyncHandler(async (req, res) => {
  const result = await feedbackService.getFeedbacks(req.user.cafeId);

  return successResponse(res, "Feedback fetched successfully", result, 200);
});

const getFeedbackSummary = asyncHandler(async (req, res) => {
  const result = await feedbackService.getFeedbackSummary(req.user.cafeId);

  return successResponse(
    res,
    "Feedback summary fetched successfully",
    result,
    200
  );
});

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedbackSummary,
};
