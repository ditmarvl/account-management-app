class CardClient {
  constructor({ logger, httpClient, config }) {
    this.logger = logger;
    this.httpClient = httpClient.create({
      baseURL: config.cardClient.url,
      timeout: config.cardClient.timeout,
      headers: { "Content-type": "application-json" },
    });
  }

  async getCardDetailsForTransaction(cardId) {
    try {
      const { data } = await this.httpClient.get("/api/");

      return data;
    } catch (error) {
      this.logger.error(
        `Error ${this.constructor.name} -> getCardDetailsForTransaction`,
        {
          data: {
            inputParameters: JSON.stringify({ cardId }),
            errorMessage: JSON.stringify(error.response?.data),
          },
        }
      );

      throw error;
    }
  }
}

module.exports = CardClient;
