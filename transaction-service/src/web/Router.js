const { Router, json } = require("express");
const cors = require("cors");
const compression = require("compression");
const methodOverride = require("method-override");
const controller = require("./utils/CreteControllerRoutes");

module.exports = ({
  config,
  containerMiddleware,
  loggerMiddleware,
  errorHandler,
  notFoundHandler,
}) => {
  const router = Router();

  if (config.env !== "production") {
    router.use(loggerMiddleware);
  }

  router
    .use(methodOverride("X-HTTP-Method-Override"))
    .use(cors())
    .use(json())
    .use(compression())
    .use(containerMiddleware);

  const apiRouter = Router();

  router.use("/health", controller("health/HealthController"));
  router.use("/", controller("system/SystemController"));

  apiRouter.use(
    "/transaction",
    controller("transaction/TransactionController")
  );

  router.use("/api", apiRouter);

  router.use(errorHandler);
  router.use(notFoundHandler);

  return router;
};
