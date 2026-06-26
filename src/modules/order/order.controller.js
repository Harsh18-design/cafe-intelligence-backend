const asyncHandler = require("../../common/utils/async-handler.util");

const { successResponse } = require("../../common/helpers/response.helper");

const orderService = require("./order.service");

const createOrder = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder(req.user.cafeId, req.body);

  return successResponse(res, "Order created successfully", result, 201);
});

const getPendingOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getPendingOrders(req.user.cafeId);

  return successResponse(
    res,
    "Pending orders fetched successfully",
    result,
    200
  );
});

const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getOrders(
    req.user.cafeId,
    req.query.status
  );

  return successResponse(res, "Orders fetched successfully", result, 200);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const result = await orderService.updateOrderStatus(
    req.user.cafeId,
    req.params.orderId,
    req.body.status
  );

  return successResponse(res, "Order status updated successfully", result, 200);
});

module.exports = {
  createOrder,
  getPendingOrders,
  getOrders,
  updateOrderStatus,
};
