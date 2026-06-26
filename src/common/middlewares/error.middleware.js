const env = require("../../config/env.config");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;
