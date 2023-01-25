const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");

const {
  UNEXPECTED_ERROR_CODE,
  INVALID_INPUT_ERROR_CODE,
} = require("../../../constants/errorCodes");

const AccountController = {
  get router() {
    const router = Router();

    router.post(
      "/",
      inject(() => this.createAccount)
    );

    router.get(
      "/user/:userId",
      inject(() => this.getByUserId)
    );

    router.get(
      "/:accountId",
      inject(() => this.getById)
    );

    router.post(
      "/:accountId/balance/decrease",
      inject(() => this.decreaseBalance)
    );

    router.post(
      "/:accountId/balance/increase",
      inject(() => this.increaseBalance)
    );

    return router;
  },

  createAccount(req, res) {
    const { accountService } = req.container.cradle;
    const { CREATE_ACCOUNT_SUCCESS, INVALID_INPUT, ERROR } =
      accountService.outputs;

    accountService
      .once(CREATE_ACCOUNT_SUCCESS, (data) => {
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

    accountService.createAccount(req.body.userId);
  },

  getByUserId(req, res) {
    const { accountService } = req.container.cradle;
    const { GET_ACCOUNT_SUCCESS, ERROR } = accountService.outputs;

    accountService
      .once(GET_ACCOUNT_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    accountService.getByUserId(req.params.userId);
  },

  getById(req, res) {
    const { accountService } = req.container.cradle;
    const { GET_ACCOUNT_SUCCESS, ERROR } = accountService.outputs;

    accountService
      .once(GET_ACCOUNT_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    accountService.getById(req.params.accountId);
  },

  decreaseBalance(req, res) {
    const { accountService } = req.container.cradle;
    const { DECREASE_BALANCE_SUCCESS, ERROR } = accountService.outputs;

    accountService
      .once(DECREASE_BALANCE_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    accountService.decreaseBalance(req.params.accountId, req.body.amount);
  },

  increaseBalance(req, res) {
    const { accountService } = req.container.cradle;
    const { INCREASE_BALANCE_SUCCESS, ERROR } = accountService.outputs;

    accountService
      .once(INCREASE_BALANCE_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    accountService.increaseBalance(req.params.accountId, req.body.amount);
  },
};

module.exports = AccountController;
