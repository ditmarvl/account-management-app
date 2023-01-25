module.exports = {
  serviceName: process.env.SERVICE_NAME || "user-service",
  web: {
    port: process.env.APP_PORT || 8001,
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
    saltRounds: +process.env.SALT_ROUNDS,
  },
};
