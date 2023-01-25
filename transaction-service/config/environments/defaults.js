module.exports = {
  serviceName: process.env.SERVICE_NAME || "transaction-service",
  web: {
    port: process.env.APP_PORT || 8004,
  },
  aws: {
    region: process.env.AWS_REGION,
    secretName: process.env.SECRET_NAME,
  },
  logging: {
    logsPath: process.env.LOGS_PATH,
  },
  secrets: {
    mongoConnectionString: `${process.env.MONGO_CONNECTION_STRING}/${process.env.DB_NAME}`,
  },
  cardClient: {
    url: process.env.CARD_SERVICE_URL || "http://localhost:8003",
    timeout: process.env.CARD_SERVICE_TIMEOUT || 60000,
  },
  accountClient: {
    url: process.env.ACCOUNT_SERVICE_URL || "http://localhost:8002",
    timeout: process.env.ACCOUNT_SERVICE_TIMEOUT || 60000,
  },
};
