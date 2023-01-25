const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const UserClient = require("../src/clients/UserClient");
const AccountClient = require("../src/clients/AccountClient");
const UserMapper = require("../src/mapper/UserMapper");
const UserService = require("../src/service/user/UserService");
const { customLogger } = require("./utils/utils");
const config = require("../config");
const {
  userMock,
  tokenMock,
  refreshTokenMock,
} = require("./mocks/userService.mock");
const {
  ADD_USER_ERROR_MSG,
  CREATE_ACCOUNT_ERROR_MSG,
  INVALID_EMAIL_ERROR_MSG,
  LOGIN_ERROR_MSG,
  INVALID_PASSWORD_ERROR_MSG,
} = require("../src/constants/errorMessages");

describe("user service tests", () => {
  let userClient;
  let accountClient;
  let userService;
  let spy;

  beforeEach(() => {
    userClient = new UserClient({
      logger: customLogger,
      httpClient: axios,
      config,
    });
    accountClient = new AccountClient({
      logger: customLogger,
      httpClient: axios,
      config,
    });
    userService = new UserService({
      logger: customLogger,
      userClient,
      accountClient,
      userMapper: UserMapper,
      bcrypt,
      jwt,
      uuidv4: v4,
      config,
    });

    spy = jest.spyOn(userService, "emit");
  });

  describe("testing addUser", () => {
    it("should create and emit user successfully", async () => {
      const { ADD_USER_SUCCESS } = userService.outputs;
      userClient.createUser = jest.fn(() => userMock);
      accountClient.createAccount = jest.fn(() => true);

      await userService.createUser(userMock);

      expect(userClient.createUser).toBeCalledWith(userMock);
      expect(accountClient.createAccount).toBeCalledWith(userMock.id);
      expect(spy).toBeCalledWith(
        ADD_USER_SUCCESS,
        userService.userMapper.toDto(userMock)
      );
    });

    it("should emit failure when user client fails", async () => {
      const { ERROR } = userService.outputs;
      userClient.createUser = jest.fn(() => {
        throw Error();
      });

      await userService.createUser(userMock);

      expect(userClient.createUser).toBeCalledWith(userMock);
      expect(spy).toBeCalledWith(ERROR, ADD_USER_ERROR_MSG);
    });

    it("should delete user before emit failure when account client fails", async () => {
      const { ERROR } = userService.outputs;
      userClient.createUser = jest.fn(() => userMock);
      accountClient.createAccount = jest.fn(() => {
        throw new Error();
      });
      userClient.deleteUser = jest.fn(() => true);

      await userService.createUser(userMock);

      expect(userClient.createUser).toBeCalledWith(userMock);
      expect(accountClient.createAccount).toBeCalledWith(userMock.id);
      expect(userClient.deleteUser).toBeCalledWith(userMock.id);
      expect(spy).toBeCalledWith(ERROR, ADD_USER_ERROR_MSG);
    });

    it("should emit failure when account is not created", async () => {
      const { CREATE_ACCOUNT_FAILED } = userService.outputs;
      userClient.createUser = jest.fn(() => userMock);
      accountClient.createAccount = jest.fn(() => false);
      userClient.deleteUser = jest.fn(() => true);

      await userService.createUser(userMock);

      expect(userClient.createUser).toBeCalledWith(userMock);
      expect(accountClient.createAccount).toBeCalledWith(userMock.id);
      expect(userClient.deleteUser).toBeCalledWith(userMock.id);
      expect(spy).toBeCalledWith(
        CREATE_ACCOUNT_FAILED,
        CREATE_ACCOUNT_ERROR_MSG
      );
    });
  });

  describe("testing login", () => {
    it("should generate access token and emit successfully", async () => {
      const { LOGIN_SUCCESS } = userService.outputs;
      userClient.getUserByEmail = jest.fn(() => userMock);
      userService.bcrypt.compareSync = jest.fn(() => true);
      userService.jwt.sign = jest.fn(() => tokenMock);
      userService.uuidv4 = jest.fn(() => refreshTokenMock);

      await userService.login(userMock.email, userMock.password);

      expect(userClient.getUserByEmail).toBeCalledWith(userMock.email);
      expect(userService.bcrypt.compareSync).toBeCalledWith(
        userMock.password,
        userMock.password
      );
      expect(userService.jwt.sign).toBeCalledWith(
        { user: userMock },
        userService.config.secretKey,
        { expiresIn: "1h" }
      );
      expect(userService.uuidv4).toHaveBeenCalledTimes(1);
      expect(spy).toBeCalledWith(LOGIN_SUCCESS, {
        accessToken: tokenMock,
        refreshToken: refreshTokenMock,
      });
    });

    it("should emit error when something is wrong with user client", async () => {
      const { ERROR } = userService.outputs;
      userClient.getUserByEmail = jest.fn(() => {
        throw new Error();
      });

      await userService.login(userMock.email, userMock.password);

      expect(userClient.getUserByEmail).toBeCalledWith(userMock.email);
      expect(spy).toBeCalledWith(ERROR, LOGIN_ERROR_MSG);
    });

    it("should emit error when user email is wrong", async () => {
      const { INVALID_EMAIL } = userService.outputs;
      userClient.getUserByEmail = jest.fn(() => false);

      await userService.login(userMock.email, userMock.password);

      expect(userClient.getUserByEmail).toBeCalledWith(userMock.email);
      expect(spy).toBeCalledWith(INVALID_EMAIL, INVALID_EMAIL_ERROR_MSG);
    });

    it("should emit error when password is invalid", async () => {
      const { INVALID_PASSWORD } = userService.outputs;
      userClient.getUserByEmail = jest.fn(() => userMock);
      bcrypt.compareSync = jest.fn(() => false);

      await userService.login(userMock.email, userMock.password);

      expect(userClient.getUserByEmail).toBeCalledWith(userMock.email);
      expect(userService.bcrypt.compareSync).toBeCalledWith(
        userMock.password,
        userMock.password
      );
      expect(spy).toBeCalledWith(INVALID_PASSWORD, INVALID_PASSWORD_ERROR_MSG);
    });
  });
});
