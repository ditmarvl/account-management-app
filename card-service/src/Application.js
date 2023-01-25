class Application {
  constructor({ server, metrics, CardModel }) {
    this.server = server;
    this.metrics = metrics;
    this.CardModel = CardModel;
  }

  async start() {
    this.metrics.init();
    await this.server.start();
  }
}

module.exports = Application;
