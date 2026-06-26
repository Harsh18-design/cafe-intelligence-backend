const asyncHandler = require("../../common/utils/async-handler.util");
const response = require("../../common/helpers/response.helper");
const { successResponse } = require("../../common/helpers/response.helper");

const analyticsService = require("./analytics.service");

const getTopSellingItems = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopSellingItems(req.user.cafeId);

  return successResponse(res, "Top selling items fetched successfully", data);
});

module.exports = {
  getTopSellingItems,
};
