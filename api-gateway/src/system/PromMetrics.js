const client = require("prom-client");
const promBundle = require("express-prom-bundle");

const { collectDefaultMetrics } = client;
const { Registry } = client;

class PromMetrics {
  init() {
    const register = new Registry();
    collectDefaultMetrics({ register });
    this.register = register;
  }

  static getExpressMiddleware() {
    return promBundle({
      buckets: [0.1, 0.4, 0.7],
      includeMethod: true,
      includePath: true,
      metricsPath: "/api/metrics",
      promClient: {
        collectDefaultMetrics: {},
      },
      urlValueParser: {
        minHexLength: 5,
        extraMasks: ["^[0-9]+\\.[0-9]+\\.[0-9]+$", /^[0-9]+-[0-9]+-[0-9]+$/],
      },
    });
  }
}

module.exports = PromMetrics;
