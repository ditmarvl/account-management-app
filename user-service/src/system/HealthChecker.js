const healthCheck = require("@cloudnative/health");

module.exports = {
  initChecks() {
    return new healthCheck.HealthChecker();
  },
};
