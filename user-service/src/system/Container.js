const { createContainer, asValue, asFunction, asClass } = require("awilix");
const { scopePerRequest } = require("awilix-express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const config = require("../../config");
const awsClient = require("./AwsClient");
const Metrics = require("./PromMetrics");
const Application = require("../Application");
const Server = require("../web/Server");
const router = require("../web/Router");
const loggerMiddleware = require("../web/utils/LoggerMiddleware");
const dbLogger = require("./DbLogger");
const logger = require("./WinstonLogger");
const healthCheck = require("./HealthChecker");

const { database, User: UserModel } = require("./Database");

// Services
const UserService = require("../service/user/UserService");

// Repositories
const UserRepository = require("../repository/UserRepository");

// Mappers
const UserMapper = require("../mapper/UserMapper");

const errorHandler = require("../web/errors/ErrorHandler");
const devErrorHandler = require("../web/errors/DevErrorHandler");

const notFoundMiddleware = require("../web/utils/NotFoundMiddleware");

async function initApp() {
  return new Promise((resolve) => {
    awsClient
      .getSecrets(config)
      .then((secrets) => {
        const container = createContainer();

        mongoose.set("strictQuery", false);
        mongoose.connect(secrets.mongoConnectionString, config.db.options);

        container.register({
          secrets: asValue(secrets),
          config: asValue(config),
          logger: asFunction(logger).singleton(),
          loggerMiddleware: asFunction(loggerMiddleware).singleton(),
          dbLogger: asFunction(dbLogger).singleton(),
          router: asFunction(router).singleton(),
          notFoundMiddleware: asFunction(notFoundMiddleware).singleton(),
        });

        container.register({
          app: asClass(Application).singleton(),
          server: asClass(Server).singleton(),
          metrics: asClass(Metrics).singleton(),
          containerMiddleware: asValue(scopePerRequest(container)),
        });

        container.register({
          bcrypt: asValue(bcrypt),
        });

        // Models
        container.register({
          database: asValue(database),
          UserModel: asValue(UserModel),
        });

        // Mappers
        container.register({
          userMapper: asValue(UserMapper),
        });

        // Repositories
        container.register({
          userRepository: asClass(UserRepository).singleton(),
        });

        // Services
        container.register({
          userService: asClass(UserService),
        });

        // Middlewares
        container.register({
          metricsMiddleware: asValue(Metrics.getExpressMiddleware()),
        });

        container.register({
          errorHandler: asValue(
            config.production ? errorHandler : devErrorHandler
          ),
          notFoundHandler: asValue(notFoundMiddleware),
        });

        container.register({
          healthChecker: asValue(healthCheck.initChecks()),
        });

        return resolve(container.resolve("app"));
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        process.exit(1);
      });
  });
}

module.exports = { initApp };
