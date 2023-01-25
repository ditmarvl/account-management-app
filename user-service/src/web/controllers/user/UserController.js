const { Router } = require("express");
const { inject } = require("awilix-express");
const Status = require("http-status");

const {
  INVALID_INPUT_ERROR_CODE,
  INVALID_EMAIL_ERROR_CODE,
  UNEXPECTED_ERROR_CODE,
  DUPLICATE_KEY_ERROR_CODE,
  USER_NOT_FOUND_ERROR_CODE,
} = require("../../../constants/errorCodes");

const UserController = {
  get router() {
    const router = Router();

    router.post(
      "/",
      inject(() => this.createUser)
    );

    router.get(
      "/:id",
      inject(() => this.getUserById)
    );

    router.get(
      "/email/:email",
      inject(() => this.getUserByEmail)
    );

    router.get(
      "/",
      inject(() => this.getAllUsers)
    );

    router.patch(
      "/:id",
      inject(() => this.updateUser)
    );

    router.delete(
      "/:id",
      inject(() => this.deleteUserById)
    );

    return router;
  },

  createUser(req, res) {
    const { userService } = req.container.cradle;
    const {
      ADD_USER_SUCCESS,
      INVALID_INPUT,
      INVALID_EMAIL,
      DUPLICATE_KEY,
      ERROR,
    } = userService.outputs;

    userService
      .once(ADD_USER_SUCCESS, (data) => {
        res.status(Status.CREATED).json(data);
      })
      .once(INVALID_INPUT, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(INVALID_EMAIL, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_EMAIL_ERROR_CODE,
        });
      })
      .once(DUPLICATE_KEY, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: DUPLICATE_KEY_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.createUser(
      req.body.email,
      req.body.password,
      req.body.firstName,
      req.body.lastName
    );
  },

  getUserById(req, res) {
    const { userService } = req.container.cradle;
    const { GET_USER_SUCCESS, USER_NOT_FOUND, ERROR } = userService.outputs;

    userService
      .once(GET_USER_SUCCESS, (data) => {
        res.status(Status.OK).json(data);
      })
      .once(USER_NOT_FOUND, (data) => {
        res.status(Status.NOT_FOUND).json({
          error: data,
          errorCode: USER_NOT_FOUND_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.getUserById(req.params.id);
  },

  getAllUsers(req, res) {
    const { userService } = req.container.cradle;
    const { GET_ALL_USERS_SUCCESS, ERROR } = userService.outputs;

    userService
      .once(GET_ALL_USERS_SUCCESS, (data) => {
        res.status(Status.OK).json(data);
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.getAllUsers();
  },

  updateUser(req, res) {
    const { userService } = req.container.cradle;
    const {
      UPDATE_USER_SUCCESS,
      USER_NOT_FOUND,
      DUPLICATE_KEY,
      INVALID_EMAIL,
      ERROR,
    } = userService.outputs;

    userService
      .once(UPDATE_USER_SUCCESS, (data) => {
        res.status(Status.OK).json(data);
      })
      .once(USER_NOT_FOUND, (data) => {
        res.status(Status.NOT_FOUND).json({
          error: data,
          errorCode: INVALID_INPUT_ERROR_CODE,
        });
      })
      .once(INVALID_EMAIL, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: INVALID_EMAIL_ERROR_CODE,
        });
      })
      .once(DUPLICATE_KEY, (data) => {
        res.status(Status.BAD_REQUEST).json({
          error: data,
          errorCode: DUPLICATE_KEY_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.updateUser(req.params.id, req.body);
  },

  deleteUserById(req, res) {
    const { userService } = req.container.cradle;
    const { DELETE_USER_SUCCESS, USER_NOT_FOUND, ERROR } = userService.outputs;

    userService
      .once(DELETE_USER_SUCCESS, (data) => {
        res.status(Status.OK).json(data);
      })
      .once(USER_NOT_FOUND, (data) => {
        res.status(Status.NOT_FOUND).json({
          error: data,
          errorCode: USER_NOT_FOUND_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.deleteUserById(req.params.id);
  },

  getUserByEmail(req, res) {
    const { userService } = req.container.cradle;
    const { GET_USER_SUCCESS, USER_NOT_FOUND, ERROR } = userService.outputs;

    userService
      .once(GET_USER_SUCCESS, (data) => {
        res.status(Status.OK).json(data);
      })
      .once(USER_NOT_FOUND, (data) => {
        res.status(Status.NOT_FOUND).json({
          error: data,
          errorCode: USER_NOT_FOUND_ERROR_CODE,
        });
      })
      .once(ERROR, (data) => {
        res
          .status(Status.INTERNAL_SERVER_ERROR)
          .json({ error: data, errorCode: UNEXPECTED_ERROR_CODE });
      });

    userService.getUserByEmail(req.params.email);
  },
};

module.exports = UserController;
