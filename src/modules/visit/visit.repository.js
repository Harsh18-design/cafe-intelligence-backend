const Visit = require("./visit.model");

const createVisit = async (data) => {
  return Visit.create(data);
};

const getCustomerVisits = async (cafeId, customerId) => {
  return Visit.find({
    cafeId,
    customerId,
  })
    .sort({ visitDate: -1 })
    .select(
      "invoiceNumber billAmount finalAmount paymentMethod visitDate createdAt"
    );
};

const getRecentVisits = async (cafeId, limit = 20) => {
  return Visit.find({ cafeId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("customerId", "customerName mobileNumber")
    .select(
      "invoiceNumber customerId subtotal discountAmount taxAmount finalAmount paymentMethod visitDate createdAt"
    );
};

const getRecentVisitsByCustomer = async (cafeId, customerId, limit = 10) => {
  return Visit.find({
    cafeId,
    customerId,
  })
    .sort({ visitDate: -1 })
    .limit(limit)
    .select(
      "invoiceNumber items subtotal discountAmount taxAmount finalAmount paymentMethod visitDate createdAt"
    );
};
const getVisitById = async (cafeId, visitId) => {
  return Visit.findOne({
    _id: visitId,
    cafeId,
  }).populate("customerId", "customerName mobileNumber email");
};

module.exports = {
  createVisit,
  getCustomerVisits,
  getRecentVisits,
  getRecentVisitsByCustomer,
  getVisitById,
};
