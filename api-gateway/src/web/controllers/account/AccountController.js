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

  /**
   * @swagger
   * /api/v1/account/{id}:
   *  get:
   *    tags: [Account]
   *    description: returns account by id
   *    produces:
   *      - application/json
   *    security:
   *      - accessToken: []
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: Numeric identifier of the account to get
   *        example: 63cf93dfb9a474672bedd8c3
   *    responses:
   *      200:
   *        description: Successful operation
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/definitions/GetAccountResponse'
   *      401:
   *        description: Unauthorized error
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/definitions/UnauthorizedErrorResponse'
   *      500:
   *        description: Something went wrong
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              $ref: '#/definitions/UnexpectedErrorResponse'
   */
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
