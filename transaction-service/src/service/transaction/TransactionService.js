const Operation = require("../Operation");

const {
  CREATE_TRANSACTION_ERROR_MSG,
  INVALID_INPUT_ERROR_MSG,
  TRANSACTION_NOT_CREATED_ERROR_MSG,
  EXPIRED_CARD_ERROR_MGS,
  // CURRENCY_NOT_SUPPORTED_ERROR_MGS,
  INSUFFICIENT_BALANCE_ERROR_MGS,
  TRANSACTION_NOT_RECEIVED_ERROR_MSG,
  RECEIVE_TRANSACTION_ERROR_MSG,
} = require("../../constants/errorMessages");

class TransactionService extends Operation {
  constructor({
    logger,
    transactionRepository,
    transactionMapper,
    cardClient,
    accountClient,
  }) {
    super();
    this.logger = logger;
    this.transactionRepository = transactionRepository;
    this.transactionMapper = transactionMapper;
    this.cardClient = cardClient;
    this.accountClient = accountClient;
  }

  async createTransaction(userData, cardData, to, reason, amount) {
    const {
      CREATE_TRANSACTION_SUCCESS,
      INVALID_INPUT,
      EXPIRED_CARD,
      INSUFFICIENT_BALANCE,
      TRANSACTION_NOT_CREATED,
      ERROR,
    } = this.outputs;

    try {
      if (!userData || !cardData || !to || !reason || !amount) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      // Check if card is expired
      const expDate = new Date(
        `20${cardData.expDate.split("/")[1]}`,
        cardData.expDate.split("/")[0]
      );

      if (expDate.getTime() < Date.now()) {
        this.logger.debug(EXPIRED_CARD_ERROR_MGS);

        return this.emit(EXPIRED_CARD, EXPIRED_CARD_ERROR_MGS);
      }

      const account = await this.accountClient.getByUserId(userData.id);

      if (account.balance < amount) {
        this.logger.debug(INSUFFICIENT_BALANCE_ERROR_MGS);

        return this.emit(INSUFFICIENT_BALANCE, INSUFFICIENT_BALANCE_ERROR_MGS);
      }

      const transaction = await this.transactionRepository.createTransaction({
        cardData,
        toFirstName: to.firstName,
        toLastName: to.lastName,
        toIban: to.iban,
        amount,
        reason,
        currency: "BGN",
        fromFirstName: userData.firstName,
        fromLastName: userData.lastName,
        fromIban: cardData.iban,
      });

      if (!transaction) {
        return this.emit(
          TRANSACTION_NOT_CREATED,
          TRANSACTION_NOT_CREATED_ERROR_MSG
        );
      }

      const balance = await this.accountClient.decreaseBalance(
        cardData.accountId,
        amount
      );

      if (!balance) {
        this.transactionRepository.deleteTransaction(transaction.id);

        return this.emit(ERROR, CREATE_TRANSACTION_ERROR_MSG);
      }

      return this.emit(
        CREATE_TRANSACTION_SUCCESS,
        this.transactionMapper.toDto(transaction)
      );
    } catch (error) {
      this.logger.error(CREATE_TRANSACTION_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({
            cardData,
            to,
            reason,
            amount,
          }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, CREATE_TRANSACTION_ERROR_MSG);
    }
  }

  async receiveTransaction(user, account, amount) {
    const {
      RECEIVE_TRANSACTION_SUCCESS,
      INVALID_INPUT,
      TRANSACTION_NOT_RECEIVED,
      ERROR,
    } = this.outputs;

    try {
      if (!account || !amount) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const transaction = await this.transactionRepository.createTransaction({
        fromFirstName: "System",
        fromLastName: "Funding",
        fromIban: "0",
        toFirstName: user.firstName,
        toLastName: user.lastName,
        toIban: account.iban,
        amount,
        currency: account.currency,
        reason: "System Funding",
      });

      if (!transaction) {
        return this.emit(
          TRANSACTION_NOT_RECEIVED,
          TRANSACTION_NOT_RECEIVED_ERROR_MSG
        );
      }

      return this.emit(RECEIVE_TRANSACTION_SUCCESS, transaction);
    } catch (error) {
      this.logger.error(RECEIVE_TRANSACTION_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ account, amount }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, RECEIVE_TRANSACTION_ERROR_MSG);
    }
  }

  async getTransactions(accountId, fromDate, toDate) {
    const { GET_TRANSACTIONS_SUCCESS, INVALID_INPUT, ERROR } = this.outputs;

    try {
      if (!accountId || !fromDate || !toDate) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      const account = await this.accountClient.getById(accountId);

      const transactions = await this.transactionRepository.getTransactions(
        account.iban,
        fromDate,
        toDate
      );

      return this.emit(
        GET_TRANSACTIONS_SUCCESS,
        this.transactionMapper.toTransactionHistory(account, transactions)
      );
    } catch (error) {
      this.logger.error(RECEIVE_TRANSACTION_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ accountId, fromDate, toDate }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, RECEIVE_TRANSACTION_ERROR_MSG);
    }
  }
}

TransactionService.setOutputs([
  "CREATE_TRANSACTION_SUCCESS",
  "RECEIVE_TRANSACTION_SUCCESS",
  "INVALID_INPUT",
  "EXPIRED_CARD",
  "CURRENCY_NOT_SUPPORTED",
  "INSUFFICIENT_BALANCE",
  "TRANSACTION_NOT_CREATED",
  "TRANSACTION_NOT_RECEIVED",
  "GET_TRANSACTIONS_SUCCESS",
  "ERROR",
]);

module.exports = TransactionService;
