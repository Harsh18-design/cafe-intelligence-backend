const Feedback = require("./feedback.model");

const createFeedback = async (payload) => {
  return Feedback.create(payload);
};

const findByOrderId = async (orderId) => {
  return Feedback.findOne({
    orderId,
  });
};

const existsByOrderId = async (orderId) => {
  return Feedback.exists({
    orderId,
  });
};

const getFeedbacks = async (cafeId) => {
  return Feedback.find({
    cafeId,
  }).sort({
    createdAt: -1,
  });
};

const getFeedbackSummary = async (cafeId) => {
  const [summary] = await Feedback.aggregate([
    {
      $match: {
        cafeId,
      },
    },
    {
      $group: {
        _id: null,

        totalFeedbacks: {
          $sum: 1,
        },

        overallRating: {
          $avg: "$overallRating",
        },

        foodRating: {
          $avg: "$foodRating",
        },

        serviceRating: {
          $avg: "$serviceRating",
        },

        ambienceRating: {
          $avg: "$ambienceRating",
        },

        cleanlinessRating: {
          $avg: "$cleanlinessRating",
        },

        recommendCount: {
          $sum: {
            $cond: ["$recommend", 1, 0],
          },
        },
      },
    },
  ]);

  return summary || null;
};

module.exports = {
  createFeedback,
  findByOrderId,
  existsByOrderId,
  getFeedbacks,
  getFeedbackSummary,
};
