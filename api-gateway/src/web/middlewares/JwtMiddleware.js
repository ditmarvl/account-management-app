const Status = require("http-status");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { jwt, config, logger } = req.container.cradle;

  const token = req.headers["x-access-token"];

  if (!token)
    return res
      .status(Status.UNAUTHORIZED)
      .json({ message: "No token provided." });

  jwt.verify(token, config.secretKey, (error, decoded) => {
    if (error) {
      logger.warn(`Token verification error: ${error.message}`);

      return res.status(Status.UNAUTHORIZED).json({ message: error.message });
    }

    req.user = decoded.user;

    return next();
  });
};
