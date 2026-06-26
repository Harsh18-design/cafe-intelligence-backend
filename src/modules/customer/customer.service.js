const AppError = require("../../common/utils/app-error.util");
const customerRepository = require("./customer.repository");
const visitRepository = require("../visit/visit.repository");

const getCustomerByMobile = async (cafeId, mobileNumber) => {
  const customer = await customerRepository.findByMobile(cafeId, mobileNumber);

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  const visitHistory = await visitRepository.getCustomerVisits(
    cafeId,
    customer._id
  );

  return {
    customer,
    visitHistory,
  };
};

const getCustomerDetails = async (cafeId, customerId) => {
  const customer = await customerRepository.findById(cafeId, customerId);

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  const recentVisits = await visitRepository.getRecentVisitsByCustomer(
    cafeId,
    customerId,
    10
  );

  return {
    customer,
    stats: {
      totalVisits: customer.totalVisits,
      totalSpent: customer.totalSpent,
      averageSpend: customer.averageSpend,
      lifetimeValue: customer.lifetimeValue,
      tier: customer.tier,
      lastVisitDate: customer.lastVisitDate,
    },
    recentVisits,
  };
};

module.exports = {
  getCustomerByMobile,
  getCustomerDetails,
};
