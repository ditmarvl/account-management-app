const Status = require("http-status");
const { UNAUTHORIZED_ERROR_MSG } = require("../../constants/errorMessages");

module.exports = (req, res, next) => {
  const { config } = req.container.cradle;

  const requestAuthorizationKey = req.headers["x-api-key"];

  if (requestAuthorizationKey !== config.authorizationKey) {
    return res
      .status(Status.UNAUTHORIZED)
      .json({ type: UNAUTHORIZED_ERROR_MSG });
  }

  return next();
};
