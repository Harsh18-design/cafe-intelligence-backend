const dashboardRepository = require("./dashboard.repository");

const getDashboardSummary = async (cafeId) => {
  const customerStats = await dashboardRepository.getCustomerStats(cafeId);
  const visitStats = await dashboardRepository.getVisitStats(cafeId);
  const topCustomers = await dashboardRepository.getTopCustomers(cafeId, 5);

  return {
    totalCustomers: customerStats.totalCustomers,
    totalVisits: visitStats.totalVisits,
    totalRevenue: visitStats.totalRevenue,
    averageBillAmount: Number((visitStats.averageBillAmount || 0).toFixed(2)),
    repeatCustomers: customerStats.repeatCustomers,
    topCustomers,
  };
};

const getRevenueTrend = async (cafeId, groupBy = "day") => {
  return dashboardRepository.getRevenueTrend(cafeId, groupBy);
};

const getTopCustomers = async (cafeId) => {
  return dashboardRepository.getTopCustomers(cafeId, 10);
};

const visitRepository = require("../visit/visit.repository");

const getRecentVisits = async (cafeId) => {
  return visitRepository.getRecentVisits(cafeId, 10);
};

const getCustomerGrowth = async (cafeId) => {
  return dashboardRepository.getCustomerGrowth(cafeId);
};

module.exports = {
  getDashboardSummary,
  getRevenueTrend,
  getTopCustomers,
  getRecentVisits,
  getCustomerGrowth,
};
