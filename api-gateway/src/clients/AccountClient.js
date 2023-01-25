class AccountClient {
  constructor({ logger, httpClient, config }) {
    this.logger = logger;
    this.httpClient = httpClient.create({
      baseURL: config.accountClient.url,
      timeout: config.accountClient.timeout,
      headers: { "Content-type": "application/json" },
    });
  }

  async createAccount(userId) {
    try {
      const { data } = await this.httpClient.post("/api/account", { userId });

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> createAccount`, {
        data: {
          inputParameters: JSON.stringify({ userId }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async increaseBalance(accountId, amount) {
    try {
      const { data } = await this.httpClient.post(
        `/api/account/${accountId}/balance/increase`,
        { amount }
      );

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> increaseBalance`, {
        data: {
          inputParameters: JSON.stringify({ accountId, amount }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async decreaseBalance(accountId, amount) {
    try {
      const { data } = await this.httpClient.post(
        `/api/account/${accountId}/balance/decrease`,
        { amount }
      );

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> decreaseBalance`, {
        data: {
          inputParameters: JSON.stringify({ accountId, amount }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async getById(accountId) {
    try {
      const { data } = await this.httpClient.get(`/api/account/${accountId}`);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> getById`, {
        data: {
          inputParameters: JSON.stringify({ accountId }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async getByUserId(userId) {
    try {
      const { data } = await this.httpClient.get(`/api/account/user/${userId}`);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> getByUserId`, {
        data: {
          inputParameters: JSON.stringify({ userId }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }
}

module.exports = AccountClient;
