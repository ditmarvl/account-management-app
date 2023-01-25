module.exports = {
  serviceName: process.env.SERVICE_NAME || "api-gateway-service",
  web: {
    port: process.env.APP_PORT || 8000,
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
  userClient: {
    url: process.env.USER_SERVICE_URL || "http://localhost:8001",
    timeout: process.env.USER_SERVICE_TIMEOUT || 60000,
  },
  cardClient: {
    url: process.env.CARD_SERVICE_URL || "http://localhost:8003",
    timeout: process.env.CARD_SERVICE_TIMEOUT || 60000,
  },
  accountClient: {
    url: process.env.ACCOUNT_SERVICE_URL || "http://localhost:8002",
    timeout: process.env.ACCOUNT_SERVICE_TIMEOUT || 60000,
  },
  transactionClient: {
    url: process.env.TRANSACTION_SERVICE_URL || "http://localhost:8004",
    timeout: process.env.TRANSACTION_SERVICE_TIMEOUT || 60000,
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  saltRounds: +process.env.SALT_ROUNDS,
  secretKey: process.env.SECRET_KEY,
  authorizationKey: process.env.AUTHORIZATION_API_KEY,
};
