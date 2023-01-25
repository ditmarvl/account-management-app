class CardClient {
  constructor({ logger, httpClient, config }) {
    this.logger = logger;
    this.httpClient = httpClient.create({
      baseURL: config.cardClient.url,
      timeout: config.cardClient.timeout,
      headers: { "Content-type": "application/json" },
    });
  }

  async addCard(cardDetails) {
    try {
      const { data } = await this.httpClient.post("/api/card", cardDetails);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> addCard`, {
        data: {
          inputParameters: JSON.stringify({ cardDetails }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async getCardsByUserId(userId) {
    try {
      const { data } = await this.httpClient.get(`/api/card/user/${userId}`);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> getCardsByUserId`, {
        data: {
          inputParameters: JSON.stringify({ userId }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async getCardById(cardId) {
    try {
      const { data } = await this.httpClient.get(`/api/card/${cardId}`);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> getCardById`, {
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
