const morgan = require("morgan");
const LoggerStreamAdapter = require("../../system/LoggerStreamAdapter");

module.exports = ({ logger }) =>
  morgan("short", {
    stream: LoggerStreamAdapter.toStream(logger),
  });
