const Status = require("http-status");
const { UNAUTHORIZED_ERROR_MSG } = require("../../constants/errorMessages");
const { UNAUTHORIZED_ERROR_CODE } = require("../../constants/errorCodes");

module.exports = (req, res, next) => {
  const { config } = req.container.cradle;

  const requestAuthorizationKey = req.headers["x-api-key"];

  if (requestAuthorizationKey !== config.authorizationKey) {
    return res.status(Status.UNAUTHORIZED).json({
      error: UNAUTHORIZED_ERROR_MSG,
      errorCode: UNAUTHORIZED_ERROR_CODE,
    });
  }

  return next();
};
