const mongoose = require("mongoose");
const env = require("./env.config");
const logger = require("../common/helpers/logger.helper");

const connectDB = async () => {
  try {
    if (!env.mongoUri) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(env.mongoUri);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
