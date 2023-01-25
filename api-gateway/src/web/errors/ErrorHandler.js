const Status = require("http-status");

module.exports = (error, req, res, next) => {
  if (error instanceof Error) {
    const { logger } = req.container.cradle;

    logger.error("Internal Server Error", {
      data: {
        errorMessage: error.message,
      },
    });

    return res.status(Status.INTERNAL_SERVER_ERROR).json({
      type: "InternalServerError",
      message: "Something went wrong",
    });
  }

  return next();
};
