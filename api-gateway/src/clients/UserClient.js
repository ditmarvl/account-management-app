class UserClient {
  constructor({ logger, httpClient, config }) {
    this.logger = logger;
    this.httpClient = httpClient.create({
      baseURL: config.userClient.url,
      timeout: config.userClient.timeout,
      headers: { "Content-type": "application/json" },
    });
  }

  async createUser(userData) {
    try {
      const { data } = await this.httpClient.post("/api/user", userData);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> createUser`, {
        data: {
          inputParameters: JSON.stringify({ userData }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const { data } = await this.httpClient.get(`/api/user/email/${email}`);

      return data;
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> getUserByEmail`, {
        data: {
          inputParameters: JSON.stringify({ email }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await this.httpClient.delete(`/api/user/${userId}`);
    } catch (error) {
      this.logger.error(`Error ${this.constructor.name} -> deleteUser`, {
        data: {
          inputParameters: JSON.stringify({ userId }),
          errorMessage: JSON.stringify(error.response?.data),
        },
      });

      throw error;
    }
  }
}

module.exports = UserClient;
