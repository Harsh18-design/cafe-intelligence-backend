const asyncHandler = require("../../common/utils/async-handler.util");
const { successResponse } = require("../../common/helpers/response.helper");
const authService = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerCafe(req.body);

  return successResponse(res, "Cafe registered successfully", result, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginCafe(req.body);

  return successResponse(res, "Login successful", result, 200);
});

const me = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user);

  return successResponse(res, "Profile fetched successfully", result, 200);
});

const updateGeoFence = asyncHandler(async (req, res) => {
  const result = await authService.updateGeoFence(req.user, req.body);

  return successResponse(res, "Geo fencing updated successfully", result, 200);
});

module.exports = {
  register,
  login,
  me,
  updateGeoFence,
};
