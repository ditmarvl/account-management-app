const Operation = require("../Operation");

const {
  INVALID_INPUT_ERROR_MSG,
  USER_NOT_FOUND_ERROR_MSG,
  GET_ACCOUNT_ERROR_MSG,
  DECREASE_BALANCE_ERROR_MSG,
  GET_BALANCE_ERROR_MSG,
  CREATE_ACCOUNT_ERROR_MSG,
} = require("../../constants/errorMessages");

class AccountService extends Operation {
  constructor({ logger, accountRepository, accountMapper }) {
    super();
    this.logger = logger;
    this.accountRepository = accountRepository;
    this.accountMapper = accountMapper;
  }

  async createAccount(userId) {
    const { CREATE_ACCOUNT_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;

    try {
      if (!userId) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const iban = `BGSTSA10${(Math.random() + 1).toString(10).substring(8)}`;
      const currency = "BGN";

      const account = await this.accountRepository.createAccount(
        iban,
        currency,
        userId
      );

      return this.emit(
        CREATE_ACCOUNT_SUCCESS,
        this.accountMapper.toDto(account)
      );
    } catch (error) {
      this.logger.error(CREATE_ACCOUNT_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify(userId),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, CREATE_ACCOUNT_ERROR_MSG);
    }
  }

  async getByUserId(userId) {
    const { GET_ACCOUNT_SUCCESS, INVALID_INPUT, USER_NOT_FOUND, ERROR } =
      this.outputs;

    try {
      if (!userId) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const account = await this.accountRepository.getByUserId(userId);

      if (!account) {
        return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
      }

      return this.emit(GET_ACCOUNT_SUCCESS, this.accountMapper.toDto(account));
    } catch (error) {
      this.logger.error(GET_ACCOUNT_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ userId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_BALANCE_ERROR_MSG);
    }
  }

  async getById(accountId) {
    const { GET_ACCOUNT_SUCCESS, INVALID_INPUT, USER_NOT_FOUND, ERROR } =
      this.outputs;

    try {
      if (!accountId) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const account = await this.accountRepository.getById(accountId);

      if (!account) {
        return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
      }

      return this.emit(GET_ACCOUNT_SUCCESS, this.accountMapper.toDto(account));
    } catch (error) {
      this.logger.error(GET_ACCOUNT_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ accountId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_BALANCE_ERROR_MSG);
    }
  }

  async decreaseBalance(userId, amount) {
    const { DECREASE_BALANCE_SUCCESS, INVALID_INPUT, USER_NOT_FOUND, ERROR } =
      this.outputs;

    try {
      if (!userId || !amount) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const account = await this.accountRepository.decreaseBalance(
        userId,
        amount
      );

      if (!account) {
        return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
      }

      return this.emit(
        DECREASE_BALANCE_SUCCESS,
        this.accountMapper.toDto(account)
      );
    } catch (error) {
      this.logger.error(DECREASE_BALANCE_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ userId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_BALANCE_ERROR_MSG);
    }
  }

  async increaseBalance(accountId, amount) {
    const { INCREASE_BALANCE_SUCCESS, INVALID_INPUT, USER_NOT_FOUND, ERROR } =
      this.outputs;

    try {
      if (!accountId || !amount) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const account = await this.accountRepository.increaseBalance(
        accountId,
        amount
      );

      if (!account) {
        return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
      }

      return this.emit(
        INCREASE_BALANCE_SUCCESS,
        this.accountMapper.toDto(account)
      );
    } catch (error) {
      this.logger.error(DECREASE_BALANCE_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ accountId, amount }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_BALANCE_ERROR_MSG);
    }
  }
}

AccountService.setOutputs([
  "CREATE_ACCOUNT_SUCCESS",
  "GET_ACCOUNT_SUCCESS",
  "INCREASE_BALANCE_SUCCESS",
  "DECREASE_BALANCE_SUCCESS",
  "INVALID_INPUT",
  "USER_NOT_FOUND",
  "ERROR",
]);

module.exports = AccountService;
