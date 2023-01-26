const Status = require("http-status");
const { INVALID_TOKEN_ERROR_MSG } = require("../../constants/errorMessages");
const { INVALID_TOKEN_ERROR_CODE } = require("../../constants/errorCodes");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { jwt, config, logger } = req.container.cradle;

  const token = req.headers["x-access-token"];

  if (!token)
    return res.status(Status.UNAUTHORIZED).json({
      error: INVALID_TOKEN_ERROR_MSG,
      errorCode: INVALID_TOKEN_ERROR_CODE,
    });

  jwt.verify(token, config.secretKey, (error, decoded) => {
    if (error) {
      logger.warn(`Token verification error: ${error.message}`);

      return res.status(Status.UNAUTHORIZED).json({
        error: INVALID_TOKEN_ERROR_MSG,
        errorCode: INVALID_TOKEN_ERROR_CODE,
      });
    }

    req.user = decoded.user;

    return next();
  });
};
