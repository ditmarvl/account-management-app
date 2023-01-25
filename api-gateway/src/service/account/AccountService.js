const Operation = require("../Operation");

const {
  INVALID_INPUT_ERROR_MSG,
  USER_NOT_FOUND_ERROR_MSG,
  GET_BALANCE_ERROR_MSG,
} = require("../../constants/errorMessages");

class AccountService extends Operation {
  constructor({ logger, accountClient }) {
    super();
    this.logger = logger;
    this.accountClient = accountClient;
  }

  async getById(id) {
    const { GET_ACCOUNT_SUCCESS, INVALID_INPUT, ACCOUNT_NOT_FOUND, ERROR } =
      this.outputs;

    try {
      if (!id) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const account = await this.accountClient.getById(id);

      if (!account) {
        return this.emit(ACCOUNT_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
      }

      return this.emit(GET_ACCOUNT_SUCCESS, account);
    } catch (error) {
      this.logger.error(GET_BALANCE_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ id }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_BALANCE_ERROR_MSG);
    }
  }
}

AccountService.setOutputs([
  "GET_ACCOUNT_SUCCESS",
  "INVALID_INPUT",
  "ACCOUNT_NOT_FOUND",
  "ERROR",
]);

module.exports = AccountService;
