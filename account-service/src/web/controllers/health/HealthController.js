const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");

const HealthController = {
  get router() {
    const router = Router();

    router.get(
      "/",
      inject(() => this.ping)
    );

    router.get(
      "/live",
      inject(() => this.livenessCheck)
    );

    router.get(
      "/ready",
      inject(() => this.readinessCheck)
    );

    router.get(
      "/health",
      inject(() => this.ping)
    );

    return router;
  },

  ping(req, res) {
    return res.status(Status.OK).json({ status: "UP" });
  },

  livenessCheck(req, res, next) {
    const { healthChecker } = req.container.cradle;

    healthChecker
      .getLivenessStatus()
      .then((result) => {
        res.status(Status.OK).json(result);
      })
      .catch(next);
  },

  readinessCheck(req, res, next) {
    const { healthChecker } = req.container.cradle;

    healthChecker
      .getReadinessStatus()
      .then((result) => {
        let statusCode = Status.OK;

        if (result.status !== "UP") {
          statusCode = Status.SERVICE_UNAVAILABLE;
        }

        res.status(statusCode).json(result);
      })
      .catch(next);
  },

  healthCheck(req, res, next) {
    const { healthChecker } = req.container.cradle;

    healthChecker
      .getStatus()
      .then((result) => {
        let statusCode = Status.OK;

        if (result.status !== "UP") {
          statusCode = Status.SERVICE_UNAVAILABLE;
        }

        res.status(statusCode).json(result);
      })
      .catch(next);
  },
};

module.exports = HealthController;
