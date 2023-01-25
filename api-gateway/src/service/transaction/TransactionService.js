const Operation = require("../Operation");

const {
  CREATE_TRANSACTION_ERROR_MSG,
  INVALID_INPUT_ERROR_MSG,
  MISSING_CARD_DATA_ERROR_MSG,
  TRANSACTION_NOT_CREATED_ERROR_MSG,
  GET_TRANSACTIONS_ERROR_MSG,
  RECEIVE_TRANSACTION_SUCCESS_ERROR_MSG,
} = require("../../constants/errorMessages");

class TransactionService extends Operation {
  constructor({ logger, transactionClient, cardClient, accountClient }) {
    super();
    this.logger = logger;
    this.transactionClient = transactionClient;
    this.cardClient = cardClient;
    this.accountClient = accountClient;
  }

  async createTransaction(user, cardId, to, reason, amount) {
    const {
      CREATE_TRANSACTION_SUCCESS,
      INVALID_INPUT,
      MISSING_CARD_DATA,
      TRANSACTION_NOT_CREATED,
      ERROR,
    } = this.outputs;

    try {
      if (!user || !cardId || !to || !reason || !amount) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const cardData = await this.cardClient.getCardById(cardId);
      const accountData = await this.accountClient.getById(cardData.accountId);
      cardData.iban = accountData.iban;

      if (!cardData) {
        return this.emit(MISSING_CARD_DATA, MISSING_CARD_DATA_ERROR_MSG);
      }

      const transaction = await this.transactionClient.createTransaction(
        user,
        cardData,
        to,
        reason,
        amount
      );

      if (!transaction) {
        return this.emit(
          TRANSACTION_NOT_CREATED,
          TRANSACTION_NOT_CREATED_ERROR_MSG
        );
      }

      return this.emit(CREATE_TRANSACTION_SUCCESS, transaction);
    } catch (error) {
      this.logger.error(CREATE_TRANSACTION_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ cardId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, CREATE_TRANSACTION_ERROR_MSG);
    }
  }

  async receiveTransaction(user, cardId, amount) {
    const { RECEIVE_TRANSACTION_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;
    let transaction;

    try {
      if (!user || !cardId || !amount) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const cardData = await this.cardClient.getCardById(cardId);
      const accountData = await this.accountClient.getById(cardData.accountId);

      transaction = await this.transactionClient.receiveTransaction(
        user,
        accountData,
        amount
      );

      await this.accountClient.increaseBalance(
        accountData.id,
        transaction.amount
      );

      return this.emit(RECEIVE_TRANSACTION_SUCCESS, transaction);
    } catch (error) {
      // if (transaction) {
      //   await this.transactionClient.removeTransaction(transaction.id);
      // }

      this.logger.error(RECEIVE_TRANSACTION_SUCCESS_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ cardId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, RECEIVE_TRANSACTION_SUCCESS_ERROR_MSG);
    }
  }

  async getTransactions(user, cardId, fromDate, toDate) {
    const {
      GET_TRANSACTIONS_SUCCESS,
      INVALID_INPUT,
      MISSING_CARD_DATA,
      ERROR,
    } = this.outputs;

    try {
      if (!user || !cardId || !fromDate || !toDate) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const cardData = await this.cardClient.getCardById(cardId);

      if (!cardData) {
        return this.emit(MISSING_CARD_DATA, MISSING_CARD_DATA_ERROR_MSG);
      }

      const transactions = await this.transactionClient.getTransactions(
        cardData.accountId,
        fromDate,
        toDate
      );

      return this.emit(GET_TRANSACTIONS_SUCCESS, transactions);
    } catch (error) {
      this.logger.error(GET_TRANSACTIONS_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ cardId }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_TRANSACTIONS_ERROR_MSG);
    }
  }
}

TransactionService.setOutputs([
  "CREATE_TRANSACTION_SUCCESS",
  "RECEIVE_TRANSACTION_SUCCESS",
  "GET_TRANSACTIONS_SUCCESS",
  "INVALID_INPUT",
  "MISSING_CARD_DATA",
  "INVALID_CARD_OWNER",
  "TRANSACTION_NOT_CREATED",
  "ERROR",
]);

module.exports = TransactionService;
