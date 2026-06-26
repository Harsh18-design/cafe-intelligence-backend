const asyncHandler = require("../../common/utils/async-handler.util");
const { successResponse } = require("../../common/helpers/response.helper");

const publicService = require("./public.service");

const getPublicMenu = asyncHandler(async (req, res) => {
  const result = await publicService.getPublicMenu(req.params.cafeId);

  return successResponse(res, "Public menu fetched successfully", result, 200);
});

const createPublicOrder = asyncHandler(async (req, res) => {
  const result = await publicService.createPublicOrder(req.body);

  return successResponse(res, "Order placed successfully", result, 201);
});

const getOrderStatus = asyncHandler(async (req, res) => {
  const result = await publicService.getOrderStatus(
    req.params.orderId,
    req.query.token
  );

  return successResponse(res, "Order status fetched successfully", result, 200);
});

module.exports = {
  getPublicMenu,
  createPublicOrder,
  getOrderStatus,
};
