const jwt = require("jsonwebtoken");

const env = require("../../config/env.config");
const AppError = require("../utils/app-error.util");
const cafeRepository = require("../../modules/cafe/cafe.repository");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret);

    const cafe = await cafeRepository.findCafeById(decoded.cafeId);

    if (!cafe) {
      throw new AppError("Cafe account not found", 401);
    }

    if (!cafe.isActive) {
      throw new AppError("Cafe account is inactive", 403);
    }

    req.user = {
      cafeId: cafe._id,
      email: cafe.email,
      role: decoded.role,
      cafeCode: cafe.cafeCode,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
