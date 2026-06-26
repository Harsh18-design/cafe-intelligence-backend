const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },

    itemCode: {
      type: String,
      trim: true,
      default: null,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: "GENERAL",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    costPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "menu_items",
  }
);

menuItemSchema.index({ cafeId: 1, itemName: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);
