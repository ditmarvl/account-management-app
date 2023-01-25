const winston = require("winston");
const os = require("os");

module.exports = ({ config }) =>
  winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} ${info.level}: ${info.message}${
            info.splat !== undefined ? `${info.splat}` : " "
          }`
      )
    ),

    level: config.local || config.development ? "debug" : "info",

    defaultMeta: {
      timestamp: new Date().getTime(),
      service: config.serviceName,
      host: os.hostname(),
      data: [],
    },

    transports: [
      new winston.transports.Console({
        format: winston.format.json(),
      }),
    ],
  });
