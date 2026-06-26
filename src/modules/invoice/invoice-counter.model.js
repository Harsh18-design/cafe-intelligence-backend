const mongoose = require("mongoose");

const invoiceCounterSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      unique: true,
    },

    lastInvoiceNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "invoice_counters",
  }
);

invoiceCounterSchema.index({ cafeId: 1 });

module.exports = mongoose.model("InvoiceCounter", invoiceCounterSchema);
