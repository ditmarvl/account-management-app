const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");
const {
  INVALID_INPUT_ERROR_CODE,
  MISSING_CARD_DATA_ERROR_CODE,
  TRANSACTION_NOT_CREATED_ERROR_CODE,
  UNEXPECTED_ERROR_CODE,
  INVALID_CARD_OWNER_ERROR_CODE,
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
      "/card/:cardId",
      inject(() => this.getTransactions)
    );

    return router;
  },

  createTransaction(req, res) {
    const { transactionService } = req.container.cradle;
    const {
      CREATE_TRANSACTION_SUCCESS,
      INVALID_INPUT,
      MISSING_CARD_DATA,
      INVALID_CARD_OWNER,
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
      .once(MISSING_CARD_DATA, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: MISSING_CARD_DATA_ERROR_CODE,
        });
      })
      .once(INVALID_CARD_OWNER, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_CARD_OWNER_ERROR_CODE,
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
      req.user,
      req.body.cardId,
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
      MISSING_CARD_DATA,
      TRANSACTION_NOT_CREATED,
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
      .once(MISSING_CARD_DATA, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: MISSING_CARD_DATA_ERROR_CODE,
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

    transactionService.receiveTransaction(
      req.user,
      req.body.cardId,
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
      req.user,
      req.params.cardId,
      req.query.fromDate,
      req.query.toDate
    );
  },
};

module.exports = TransactionController;
