const Customer = require("./customer.model");

const createCustomer = async (data) => {
  return Customer.create(data);
};

const findByMobile = async (cafeId, mobileNumber) => {
  return Customer.findOne({
    cafeId,
    mobileNumber,
  });
};

const findById = async (cafeId, customerId) => {
  return Customer.findOne({
    _id: customerId,
    cafeId,
  });
};

const updateCustomerById = async (customerId, updateData) => {
  return Customer.findByIdAndUpdate(customerId, updateData, {
    new: true,
  });
};

const getTopCustomers = async (cafeId, limit = 5) => {
  return Customer.find({ cafeId })
    .sort({ totalSpent: -1 })
    .limit(limit)
    .select(
      "mobileNumber customerName totalVisits totalSpent averageSpend lastVisitDate"
    );
};

module.exports = {
  createCustomer,
  findByMobile,
  findById,
  updateCustomerById,
  getTopCustomers,
};
