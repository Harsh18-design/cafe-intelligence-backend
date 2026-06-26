const asyncHandler = require("../../common/utils/async-handler.util");
const { successResponse } = require("../../common/helpers/response.helper");
const dashboardService = require("./dashboard.service");

const getRevenueTrend = asyncHandler(async (req, res) => {
  const groupBy = req.query.groupBy || "day";

  const result = await dashboardService.getRevenueTrend(
    req.user.cafeId,
    groupBy
  );

  return successResponse(
    res,
    "Revenue trend fetched successfully",
    result,
    200
  );
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  const result = await dashboardService.getDashboardSummary(req.user.cafeId);

  return successResponse(
    res,
    "Dashboard summary fetched successfully",
    result,
    200
  );
});

const getCustomerGrowth = asyncHandler(async (req, res) => {
  const result = await dashboardService.getCustomerGrowth(req.user.cafeId);

  return successResponse(res, "Customer growth fetched", result);
});

const getTopCustomers = asyncHandler(async (req, res) => {
  const result = await dashboardService.getTopCustomers(req.user.cafeId);

  return successResponse(res, "Top customers fetched", result);
});

const getRecentVisits = asyncHandler(async (req, res) => {
  const result = await dashboardService.getRecentVisits(req.user.cafeId);

  return successResponse(res, "Recent visits fetched", result);
});

module.exports = {
  getDashboardSummary,
  getRevenueTrend,
  getCustomerGrowth,
  getTopCustomers,
  getRecentVisits,
};
