class Application {
  constructor({ server, metrics }) {
    this.server = server;
    this.metrics = metrics;
  }

  async start() {
    this.metrics.init();
    await this.server.start();
  }
}

module.exports = Application;
