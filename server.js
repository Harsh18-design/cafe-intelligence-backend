const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db.config");
const env = require("./src/config/env.config");
const logger = require("./src/common/helpers/logger.helper");
const { initSocket } = require("./src/config/socket");

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  initSocket(server);

  server.listen(env.port, "192.168.1.11", () => {
    logger.info(`Server running on http://192.168.1.11:${env.port}`);
  });
};

startServer();
