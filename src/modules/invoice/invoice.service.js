const invoiceRepository = require("./invoice.repository");

const formatInvoiceNumber = (number) => {
  return `INV-${String(number).padStart(6, "0")}`;
};

const generateInvoiceNumber = async (cafeId) => {
  const counter = await invoiceRepository.getNextInvoiceCounter(cafeId);

  return formatInvoiceNumber(counter.lastInvoiceNumber);
};

module.exports = {
  generateInvoiceNumber,
};
