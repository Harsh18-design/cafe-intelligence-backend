const AppError = require("../../common/utils/app-error.util");

const feedbackRepository = require("./feedback.repository");
const orderRepository = require("../order/order.repository");

const createFeedback = async (payload) => {
  const order = await orderRepository.getPublicOrderStatus(
    payload.orderId,
    payload.trackingToken
  );

  if (!order) {
    throw new AppError("Invalid order", 404);
  }

  if (order.status !== "COMPLETED") {
    throw new AppError(
      "Feedback can only be submitted after the order is completed",
      400
    );
  }

  const existingFeedback = await feedbackRepository.findByOrderId(
    payload.orderId
  );

  if (existingFeedback) {
    throw new AppError("Feedback already submitted for this order", 409);
  }

  const feedback = await feedbackRepository.createFeedback({
    cafeId: order.cafeId._id || order.cafeId,
    orderId: order._id,
    visitId: order.visitId || null,
    customerName: order.customerName,
    mobileNumber: order.mobileNumber,

    overallRating: payload.overallRating,
    foodRating: payload.foodRating,
    serviceRating: payload.serviceRating,
    ambienceRating: payload.ambienceRating,
    cleanlinessRating: payload.cleanlinessRating,

    recommend: payload.recommend,
    comment: payload.comment || null,
  });

  return feedback;
};

const getFeedbacks = async (cafeId) => {
  return feedbackRepository.getFeedbacks(cafeId);
};

const getFeedbackSummary = async (cafeId) => {
  return feedbackRepository.getFeedbackSummary(cafeId);
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedbackSummary,
};
