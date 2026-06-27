const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },

    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      default: null,
    },

    customerName: {
      type: String,
      trim: true,
      default: null,
    },

    mobileNumber: {
      type: String,
      trim: true,
      default: null,
    },

    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    foodRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    serviceRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    ambienceRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    cleanlinessRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    recommend: {
      type: Boolean,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "feedback",
  }
);

feedbackSchema.index({ cafeId: 1, createdAt: -1 });
feedbackSchema.index({ cafeId: 1, overallRating: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
