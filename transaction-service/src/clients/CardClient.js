class CardClient {
  constructor({ logger, httpClient, config }) {
    this.logger = logger;
    this.httpClient = httpClient.create({
      baseURL: config.cardClient.url,
      timeout: config.cardClient.timeout,
      headers: { "Content-type": "application/json" },
    });
  }

  async getCard(cardId) {
    try {
      const { data } = await this.httpClient.get(`/api/card/${cardId}`);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> getCard`, {
        data: {
          inputParameters: JSON.stringify({ cardId }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }
}

module.exports = CardClient;
