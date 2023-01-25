const Status = require("http-status");

module.exports = (req, res) => {
  const { logger } = req.container.cradle;

  logger.warn("Endpoint not found", {
    data: {
      errorMessage: `[${req.url}] handler not found`,
    },
  });

  return res.status(Status.NOT_FOUND).json({
    type: "Endpoint not found",
  });
};
