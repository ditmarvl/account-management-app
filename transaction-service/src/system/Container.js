const { createContainer, asValue, asFunction, asClass } = require("awilix");
const { scopePerRequest } = require("awilix-express");
const mongoose = require("mongoose");
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

const { database, Transaction: TransactionModel } = require("./Database");

// Services
const TransactionService = require("../service/transaction/TransactionService");

// Mappers
const TransactionMapper = require("../mapper/TransactionMapper");

// Clients
const CardClient = require("../clients/CardClient");
const AccountClient = require("../clients/AccountClient");

const errorHandler = require("../web/errors/ErrorHandler");
const devErrorHandler = require("../web/errors/DevErrorHandler");

const notFoundMiddleware = require("../web/utils/NotFoundMiddleware");
const TransactionRepository = require("../repository/TransactionRepository");

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
          uuidv4: asValue(v4),
          httpClient: asValue(axios),
        });

        // Models
        container.register({
          database: asValue(database),
          TransactionModel: asValue(TransactionModel),
        });

        // Repositories
        container.register({
          transactionRepository: asClass(TransactionRepository).singleton(),
        });

        // Mappers
        container.register({
          transactionMapper: asValue(TransactionMapper),
        });

        // Services
        container.register({
          transactionService: asClass(TransactionService),
        });

        // Middlewares
        container.register({
          metricsMiddleware: asValue(Metrics.getExpressMiddleware()),
        });

        // Clients
        container.register({
          cardClient: asClass(CardClient).singleton(),
          accountClient: asClass(AccountClient).singleton(),
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
