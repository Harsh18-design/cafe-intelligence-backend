const asyncHandler = require("../../common/utils/async-handler.util");
const { successResponse } = require("../../common/helpers/response.helper");
const visitService = require("./visit.service");

const createVisit = asyncHandler(async (req, res) => {
  const result = await visitService.createVisit(req.user.cafeId, req.body);

  return successResponse(res, "Visit saved successfully", result, 201);
});

const getRecentVisits = asyncHandler(async (req, res) => {
  const result = await visitService.getRecentVisits(req.user.cafeId);

  return successResponse(res, "Recent bills fetched successfully", result, 200);
});

const getVisitDetails = asyncHandler(async (req, res) => {
  const result = await visitService.getVisitDetails(
    req.user.cafeId,
    req.params.visitId
  );

  return successResponse(res, "Bill details fetched successfully", result, 200);
});

module.exports = {
  createVisit,
  getRecentVisits,
  getVisitDetails,
};
