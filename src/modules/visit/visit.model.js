const mongoose = require("mongoose");

const visitItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const visitSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },

    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    items: {
      type: [visitItemSchema],
      default: [],
    },

    billAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "WALLET", "OTHER"],
      default: "UPI",
    },

    pointsEarned: {
      type: Number,
      default: 0,
    },

    visitDate: {
      type: Date,
      default: Date.now,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "visits",
  }
);

visitSchema.index(
  {
    cafeId: 1,
    invoiceNumber: 1,
  },
  {
    unique: true,
  }
);

visitSchema.index({
  cafeId: 1,
  visitDate: -1,
});

visitSchema.index({
  cafeId: 1,
  customerId: 1,
});

module.exports = mongoose.model("Visit", visitSchema);
