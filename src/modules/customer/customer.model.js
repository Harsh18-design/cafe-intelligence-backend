const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    customerName: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    birthday: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER", null],
      default: null,
    },

    totalVisits: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    averageSpend: {
      type: Number,
      default: 0,
    },

    points: {
      type: Number,
      default: 0,
    },

    tier: {
      type: String,
      enum: ["NEW", "REGULAR", "VIP"],
      default: "NEW",
    },

    lifetimeValue: {
      type: Number,
      default: 0,
    },

    favoriteItemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    favoriteCategory: {
      type: String,
      default: null,
    },

    firstVisitDate: {
      type: Date,
      default: null,
    },

    lastVisitDate: {
      type: Date,
      default: null,
    },

    isLostCustomer: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
    },
  },
  {
    timestamps: true,
    collection: "customers",
  }
);

customerSchema.index({ cafeId: 1, mobileNumber: 1 }, { unique: true });
customerSchema.index({ cafeId: 1, totalSpent: -1 });
customerSchema.index({ cafeId: 1, lastVisitDate: -1 });

module.exports = mongoose.model("Customer", customerSchema);
