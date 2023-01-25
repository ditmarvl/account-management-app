class TransactionClient {
  constructor({ logger, httpClient, config }) {
    this.logger = logger;
    this.httpClient = httpClient.create({
      baseURL: config.transactionClient.url,
      timeout: config.transactionClient.timeout,
      headers: { "Content-type": "application/json" },
    });
  }

  async createTransaction(userData, cardData, to, reason, amount) {
    try {
      const { data } = await this.httpClient.post("/api/transaction", {
        userData,
        cardData,
        to,
        reason,
        amount,
      });

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> createTransaction`, {
        data: {
          inputParameters: JSON.stringify({ ...userData, ...cardData }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async receiveTransaction(user, account, amount) {
    try {
      const { data } = await this.httpClient.post(`/api/transaction/receive`, {
        user,
        account,
        amount,
      });

      return data;
    } catch (error) {
      this.logger.error(
        `Error ${this.constructor.name} -> receiveTransaction`,
        {
          data: {
            inputParameters: JSON.stringify({ account, amount }),
            errorMessage: JSON.stringify(error.response?.data),
          },
        }
      );

      throw error;
    }
  }

  async getTransactions(accountId, fromDate, toDate) {
    try {
      const { data } = await this.httpClient.get(
        `/api/transaction/account/${accountId}?fromDate=${fromDate}&toDate=${toDate}`
      );

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> getTransactions`, {
        data: {
          inputParameters: JSON.stringify({
            accountId,
            fromDate,
            toDate,
          }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }
}

module.exports = TransactionClient;
