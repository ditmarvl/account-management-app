const Status = require("http-status");

module.exports = (error, req, res, next) => {
  if (error instanceof Error) {
    const { logger, config } = req.container.cradle;

    const errorMessage = error.toString();
    let stack = null;
    if (config.local || config.development) {
      stack = error.stack;
    }

    logger.error("Internal Server Error", {
      data: {
        errorMessage: `${errorMessage}\r\n${stack}`,
      },
    });

    return res.status(Status.INTERNAL_SERVER_ERROR).json({
      type: "InternalServerError",
      message: errorMessage,
      stack,
    });
  }

  return next();
};
