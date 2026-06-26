const InvoiceCounter = require("./invoice-counter.model");

const createInvoiceCounter = async (cafeId) => {
  return InvoiceCounter.create({
    cafeId,
    lastInvoiceNumber: 0,
  });
};

const getNextInvoiceCounter = async (cafeId) => {
  return InvoiceCounter.findOneAndUpdate(
    { cafeId },
    { $inc: { lastInvoiceNumber: 1 } },
    {
      new: true,
      upsert: true,
    }
  );
};

module.exports = {
  createInvoiceCounter,
  getNextInvoiceCounter,
};
