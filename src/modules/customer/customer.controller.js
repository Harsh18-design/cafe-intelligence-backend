const asyncHandler = require("../../common/utils/async-handler.util");
const { successResponse } = require("../../common/helpers/response.helper");
const customerService = require("./customer.service");

const searchCustomer = asyncHandler(async (req, res) => {
  const { mobileNumber } = req.body;

  const result = await customerService.getCustomerByMobile(
    req.user.cafeId,
    mobileNumber
  );

  return successResponse(res, "Customer fetched successfully", result, 200);
});

const getCustomerDetails = asyncHandler(async (req, res) => {
  const result = await customerService.getCustomerDetails(
    req.user.cafeId,
    req.params.customerId
  );

  return successResponse(
    res,
    "Customer details fetched successfully",
    result,
    200
  );
});

module.exports = {
  searchCustomer,
  getCustomerDetails,
};
