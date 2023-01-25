const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");

const SystemController = {
  get router() {
    const router = Router();

    router.get(
      "/ping/",
      inject(() => this.ping)
    );

    return router;
  },

  ping(req, res) {
    return res.status(Status.OK).json({ status: "live" });
  },
};

module.exports = SystemController;
