const bcrypt = require("bcrypt");
const UserRepository = require("../src/repository/UserRepository");
const UserMapper = require("../src/mapper/UserMapper");
const UserService = require("../src/service/user/UserService");
const config = require("../config");
const { customLogger } = require("./utils/utils");
const { userMock } = require("./mocks/user.mock");
const {
  ADD_USER_ERROR_MSG,
  INVALID_INPUT_ERROR_MSG,
  INVALID_EMAIL_ERROR_MSG,
  DUPLICATE_KEY_ERROR_MSG,
} = require("../src/constants/errorMessages");

describe("user service tests", () => {
  const UserModel = {};
  let userRepository;
  let userService;
  let spy;

  beforeEach(() => {
    userRepository = new UserRepository({
      logger: customLogger,
      UserModel,
      userMapper: UserMapper,
      config,
    });
    userService = new UserService({
      logger: customLogger,
      userRepository,
      userMapper: UserMapper,
      bcrypt,
      secrets: config.secrets,
    });

    spy = jest.spyOn(userService, "emit");
  });

  describe("testing createUser", () => {
    it("should create and emit user successfully", async () => {
      const { ADD_USER_SUCCESS } = userService.outputs;
      userService.bcrypt.hash = jest.fn(() => userMock.password);
      userRepository.createUser = jest.fn(() => userMock);

      await userService.createUser(
        userMock.email,
        userMock.password,
        userMock.firstName,
        userMock.lastName
      );

      expect(bcrypt.hash).toBeCalledWith(
        userMock.password,
        config.secrets.saltRounds
      );
      expect(userRepository.createUser).toBeCalledWith(
        userMock.email,
        userMock.password,
        userMock.firstName,
        userMock.lastName
      );
      expect(spy).toBeCalledWith(
        ADD_USER_SUCCESS,
        userService.userMapper.toDto(userMock)
      );
    });

    it("should emit failure when input is not correct", async () => {
      const { INVALID_INPUT } = userService.outputs;

      await userService.createUser();

      expect(spy).toBeCalledWith(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
    });

    it("should emit failure when email is not valid", async () => {
      const { INVALID_EMAIL } = userService.outputs;

      await userService.createUser(
        "a@a.a",
        userMock.password,
        userMock.firstName,
        userMock.lastName
      );

      expect(spy).toBeCalledWith(INVALID_EMAIL, INVALID_EMAIL_ERROR_MSG);
    });

    it("should emit failure when error occurs", async () => {
      const { ERROR } = userService.outputs;
      userService.bcrypt.hash = jest.fn(() => {
        throw new Error();
      });

      await userService.createUser(
        userMock.email,
        userMock.password,
        userMock.firstName,
        userMock.lastName
      );

      expect(spy).toBeCalledWith(ERROR, ADD_USER_ERROR_MSG);
    });

    it("should emit failure when error occurs", async () => {
      const { DUPLICATE_KEY } = userService.outputs;
      userService.bcrypt.hash = jest.fn(() => userMock.password);
      const error = new Error();
      error.code = 11000;
      userRepository.createUser = jest.fn(() => {
        throw error;
      });

      await userService.createUser(
        userMock.email,
        userMock.password,
        userMock.firstName,
        userMock.lastName
      );

      expect(spy).toBeCalledWith(DUPLICATE_KEY, DUPLICATE_KEY_ERROR_MSG);
    });
  });
});
