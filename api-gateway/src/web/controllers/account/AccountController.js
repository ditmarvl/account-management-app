const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");
const {
  INVALID_INPUT_ERROR_CODE,
  UNEXPECTED_ERROR_CODE,
} = require("../../../constants/errorCodes");

const AccountController = {
  get router() {
    const router = Router();

    router.get(
      "/:id",
      inject(() => this.getById)
    );

    return router;
  },

  getById(req, res) {
    const { accountService } = req.container.cradle;
    const { GET_ACCOUNT_SUCCESS, INVALID_INPUT, ACCOUNT_NOT_FOUND, ERROR } =
      accountService.outputs;

    accountService
      .once(GET_ACCOUNT_SUCCESS, (data) => {
        res.status(Status.OK).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(ACCOUNT_NOT_FOUND, (data) => {
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

    accountService.getById(req.params.id);
  },
};

module.exports = AccountController;
