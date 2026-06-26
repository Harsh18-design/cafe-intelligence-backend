const { successResponse } = require("../../common/helpers/response.helper");

const healthCheck = (req, res) => {
  return successResponse(res, "Cafe Intelligence API is running", {
    status: "OK",
    service: "cafe-intelligence-backend",
    timestamp: new Date(),
  });
};

module.exports = {
  healthCheck,
};
