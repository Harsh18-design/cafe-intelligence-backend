const AppError = require("../utils/app-error.util");

const notFoundMiddleware = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

module.exports = notFoundMiddleware;
