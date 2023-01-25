const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");
const {
  INVALID_INPUT_ERROR_CODE,
  EXPIRED_CARD_ERROR_CODE,
  TRANSACTION_NOT_CREATED_ERROR_CODE,
  UNEXPECTED_ERROR_CODE,
} = require("../../../constants/errorCodes");

const TransactionController = {
  get router() {
    const router = Router();

    router.post(
      "/",
      inject(() => this.createTransaction)
    );

    router.post(
      "/receive",
      inject(() => this.receiveTransaction)
    );

    router.get(
      "/account/:accountId",
      inject(() => this.getTransactions)
    );

    return router;
  },

  createTransaction(req, res) {
    const { transactionService } = req.container.cradle;
    const {
      CREATE_TRANSACTION_SUCCESS,
      INVALID_INPUT,
      EXPIRED_CARD,
      TRANSACTION_NOT_CREATED,
      ERROR,
    } = transactionService.outputs;

    transactionService
      .once(CREATE_TRANSACTION_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(EXPIRED_CARD, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: EXPIRED_CARD_ERROR_CODE,
        });
      })
      .once(TRANSACTION_NOT_CREATED, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: TRANSACTION_NOT_CREATED_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    transactionService.createTransaction(
      req.body.userData,
      req.body.cardData,
      req.body.to,
      req.body.reason,
      req.body.amount
    );
  },

  receiveTransaction(req, res) {
    const { transactionService } = req.container.cradle;
    const {
      RECEIVE_TRANSACTION_SUCCESS,
      INVALID_INPUT,
      TRANSACTION_NOT_RECEIVED,
      ERROR,
    } = transactionService.outputs;

    transactionService
      .once(RECEIVE_TRANSACTION_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(TRANSACTION_NOT_RECEIVED, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: TRANSACTION_NOT_CREATED_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    transactionService.receiveTransaction(
      req.body.user,
      req.body.account,
      req.body.amount
    );
  },

  getTransactions(req, res) {
    const { transactionService } = req.container.cradle;
    const { GET_TRANSACTIONS_SUCCESS, INVALID_INPUT, ERROR } =
      transactionService.outputs;

    transactionService
      .once(GET_TRANSACTIONS_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    transactionService.getTransactions(
      req.params.accountId,
      req.query.fromDate,
      req.query.toDate
    );
  },
};

module.exports = TransactionController;
