const analyticsRepository = require("./analytics.repository");

const getTopSellingItems = async (cafeId) => {
  return analyticsRepository.getTopSellingItems(cafeId);
};

module.exports = {
  getTopSellingItems,
};
