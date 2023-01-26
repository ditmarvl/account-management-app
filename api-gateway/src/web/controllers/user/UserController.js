const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");

const {
  // INVALID_INPUT_ERROR_CODE,
  INVALID_EMAIL_ERROR_CODE,
  INVALID_PASSWORD_ERROR_CODE,
  UNEXPECTED_ERROR_CODE,
  // DUPLICATE_KEY_ERROR_CODE,
  // USER_NOT_FOUND_ERROR_CODE,
} = require("../../../constants/errorCodes");

const UserController = {
  get router() {
    const router = Router();

    router.post(
      "/",
      inject(() => this.createUser)
    );

    router.post(
      "/login",
      inject(() => this.login)
    );

    return router;
  },
  /**
   * @swagger
   * /api/v1/user:
   *  post:
   *    tags: [User]
   *    description: creates user and account in the system
   *    produces:
   *      - application/json
   *    security:
   *      - apiKey: []
   *    requestBody:
   *        name: user
   *        description: The user to create
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/definitions/CreateUserRequestBody'
   *    responses:
   *      200:
   *        description: Successful operation
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/definitions/CreateUserResponse'
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
  createUser(req, res) {
    const { userService } = req.container.cradle;
    const { ADD_USER_SUCCESS, ERROR } = userService.outputs;

    userService
      .once(ADD_USER_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.createUser(req.body);
  },

  /**
   * @swagger
   * /api/v1/user/login:
   *  post:
   *    tags: [User]
   *    description: logs in user in the system by generating a token
   *    produces:
   *      - application/json
   *    security:
   *      - apiKey: []
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *            properties:
   *              email:
   *                type: string
   *                example: some@info.com
   *              password:
   *                type: string
   *                example: Testing@123
   *    responses:
   *      200:
   *        description: Successful operation
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/definitions/CreateUserResponse'
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
  login(req, res) {
    const { userService } = req.container.cradle;
    const { LOGIN_SUCCESS, INVALID_EMAIL, INVALID_PASSWORD, ERROR } =
      userService.outputs;

    userService
      .once(LOGIN_SUCCESS, (data) => {
        res.status(Status.OK).json(data);
      })
      .once(INVALID_EMAIL, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_EMAIL_ERROR_CODE,
        });
      })
      .once(INVALID_PASSWORD, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_PASSWORD_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.login(req.body.email, req.body.password);
  },
};

module.exports = UserController;
