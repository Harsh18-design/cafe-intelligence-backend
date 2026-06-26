const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const notFoundMiddleware = require("./common/middlewares/not-found.midleware");
const errorMiddleware = require("./common/middlewares/error.middleware");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const healthRoutes = require("./modules/health/health.routes");
const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api/v1", routes);

app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/health", healthRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
