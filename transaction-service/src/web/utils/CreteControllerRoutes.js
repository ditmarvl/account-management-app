const path = require("path");

module.exports = function CreteControllerRoutes(controllerUrl) {
  const controllerPath = path.resolve("src/web/controllers", controllerUrl);

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const Controller = require(controllerPath);

  return Controller.router;
};
