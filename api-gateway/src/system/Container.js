const { createContainer, asValue, asFunction, asClass } = require("awilix");
const { scopePerRequest } = require("awilix-express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const axios = require("axios");

const config = require("../../config");
const awsClient = require("./AwsClient");
const Metrics = require("./PromMetrics");

const logger = require("./WinstonLogger");

const Application = require("../Application");
const Server = require("../web/Server");
const router = require("../web/Router");
const loggerMiddleware = require("../web/utils/LoggerMiddleware");
const dbLogger = require("./DbLogger");
const healthCheck = require("./HealthChecker");

// Services
const AccountService = require("../service/account/AccountService");
const UserService = require("../service/user/UserService");
const CardService = require("../service/card/CardService");
const TransactionService = require("../service/transaction/TransactionService");

// Mappers
const UserMapper = require("../mapper/UserMapper");

// Middlewares
const JwtMiddleware = require("../web/middlewares/JwtMiddleware");
const ApiKeyMiddleware = require("../web/middlewares/ApiKeyMiddleware");

// Clients
const CardClient = require("../clients/CardClient");
const UserClient = require("../clients/UserClient");
const AccountClient = require("../clients/AccountClient");
const TransactionClient = require("../clients/TransactionClient");

const errorHandler = require("../web/errors/ErrorHandler");
const devErrorHandler = require("../web/errors/DevErrorHandler");

const notFoundMiddleware = require("../web/utils/NotFoundMiddleware");

const swagger = require("./Swagger");

async function initApp() {
  return new Promise((resolve) => {
    awsClient
      .getSecrets(config)
      .then((secrets) => {
        const container = createContainer();

        mongoose.set("strictQuery", false);
        mongoose.connect(secrets.mongoConnectionString, config.db.options);

        container.register({ swagger: asValue(swagger) });

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
          jwt: asValue(jwt),
          bcrypt: asValue(bcrypt),
          uuidv4: asValue(v4),
          httpClient: asValue(axios),
        });

        // Mappers
        container.register({
          userMapper: asValue(UserMapper),
        });

        // Services
        container.register({
          userService: asClass(UserService),
          cardService: asClass(CardService),
          transactionService: asClass(TransactionService),
          accountService: asClass(AccountService),
        });

        // Middlewares
        container.register({
          metricsMiddleware: asValue(Metrics.getExpressMiddleware()),
          jwtMiddleware: asValue(JwtMiddleware),
          apiKeyMiddleware: asValue(ApiKeyMiddleware),
        });

        // Clients
        container.register({
          cardClient: asClass(CardClient).singleton(),
          userClient: asClass(UserClient).singleton(),
          accountClient: asClass(AccountClient).singleton(),
          transactionClient: asClass(TransactionClient).singleton(),
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
