const asyncHandler = require("../../common/utils/async-handler.util");
const { successResponse } = require("../../common/helpers/response.helper");
const menuService = require("./menu.service");

const createMenuItem = asyncHandler(async (req, res) => {
  const result = await menuService.createMenuItem(req.user.cafeId, req.body);

  return successResponse(res, "Menu item created successfully", result, 201);
});

const getMenuItems = asyncHandler(async (req, res) => {
  const result = await menuService.getMenuItems(req.user.cafeId);

  return successResponse(res, "Menu items fetched successfully", result, 200);
});

const getActiveMenuItems = asyncHandler(async (req, res) => {
  const result = await menuService.getActiveMenuItems(req.user.cafeId);

  return successResponse(
    res,
    "Active menu items fetched successfully",
    result,
    200
  );
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const result = await menuService.updateMenuItem(
    req.user.cafeId,
    req.params.itemId,
    req.body
  );

  return successResponse(res, "Menu item updated successfully", result, 200);
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const result = await menuService.deleteMenuItem(
    req.user.cafeId,
    req.params.itemId
  );

  return successResponse(res, "Menu item disabled successfully", result, 200);
});

module.exports = {
  createMenuItem,
  getMenuItems,
  getActiveMenuItems,
  updateMenuItem,
  deleteMenuItem,
};
