const { Router, json } = require("express");
const cors = require("cors");
const compression = require("compression");
const methodOverride = require("method-override");
const controller = require("./utils/CreteControllerRoutes");

module.exports = ({
  config,
  containerMiddleware,
  loggerMiddleware,
  jwtMiddleware,
  apiKeyMiddleware,
  errorHandler,
  notFoundHandler,
  swagger,
}) => {
  const router = Router();

  router
    .use(methodOverride("X-HTTP-Method-Override"))
    .use(cors())
    .use(json())
    .use(compression())
    .use(containerMiddleware);

  if (config.env !== "production") {
    router.use(loggerMiddleware);

    router.get(`${swagger.path}/v1.json`, (req, res) =>
      res.json(swagger.specifications.v1)
    );

    router.use(
      swagger.path,
      swagger.ui.serveFiles(null, swagger.options),
      swagger.ui.setup(null, swagger.options)
    );
  }

  const apiV1Router = Router();

  apiV1Router.use("/user", apiKeyMiddleware, controller("user/UserController"));
  apiV1Router.use(
    "/account",
    jwtMiddleware,
    controller("account/AccountController")
  );
  apiV1Router.use("/card", jwtMiddleware, controller("card/CardController"));
  apiV1Router.use(
    "/transaction",
    jwtMiddleware,
    controller("transaction/TransactionController")
  );

  router.use("/health", controller("health/HealthController"));
  router.use("/", controller("system/SystemController"));

  router.use("/api/v1", apiV1Router);

  router.use(errorHandler);
  router.use(notFoundHandler);

  return router;
};
