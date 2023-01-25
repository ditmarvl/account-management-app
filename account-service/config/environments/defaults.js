module.exports = {
  serviceName: process.env.SERVICE_NAME || "account-service",
  web: {
    port: process.env.APP_PORT || 8002,
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
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    saltRounds: +process.env.SALT_ROUNDS,
    secretKey: process.env.SECRET_KEY,
    authorizationKey: process.env.AUTHORIZATION_API_KEY,
  },
};
