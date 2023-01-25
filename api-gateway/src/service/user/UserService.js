const Operation = require("../Operation");

const {
  ADD_USER_ERROR_MSG,
  INVALID_EMAIL_ERROR_MSG,
  INVALID_PASSWORD_ERROR_MSG,
  // INVALID_REFRESH_TOKEN_ERROR_MSG,
  // REFRESH_TOKEN_ERROR_MSG,
  LOGIN_ERROR_MSG,
  CREATE_ACCOUNT_ERROR_MSG,
} = require("../../constants/errorMessages");

class UserService extends Operation {
  constructor({
    logger,
    userClient,
    accountClient,
    userMapper,
    config,
    bcrypt,
    jwt,
    uuidv4,
  }) {
    super();
    this.logger = logger;
    this.userClient = userClient;
    this.accountClient = accountClient;
    this.userMapper = userMapper;
    this.config = config;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.uuidv4 = uuidv4;
  }

  async createUser(userData) {
    const { ADD_USER_SUCCESS, CREATE_ACCOUNT_FAILED, ERROR } = this.outputs;
    let userEntity;

    try {
      userEntity = await this.userClient.createUser(userData);

      const userAccount = await this.accountClient.createAccount(userEntity.id);
      if (!userAccount) {
        await this.userClient.deleteUser(userEntity.id);

        return this.emit(CREATE_ACCOUNT_FAILED, CREATE_ACCOUNT_ERROR_MSG);
      }

      return this.emit(
        ADD_USER_SUCCESS,
        this.userMapper.toDto(userEntity, userAccount)
      );
    } catch (error) {
      if (userEntity) {
        await this.userClient.deleteUser(userEntity.id);
      }

      return this.emit(ERROR, ADD_USER_ERROR_MSG);
    }
  }

  async login(email, password) {
    const { LOGIN_SUCCESS, INVALID_EMAIL, INVALID_PASSWORD, ERROR } =
      this.outputs;

    try {
      const user = await this.userClient.getUserByEmail(email);

      if (!user) {
        return this.emit(INVALID_EMAIL, INVALID_EMAIL_ERROR_MSG);
      }

      const isValidPassword = this.bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        return this.emit(INVALID_PASSWORD, INVALID_PASSWORD_ERROR_MSG);
      }

      const accessToken = this.jwt.sign(
        { user: this.userMapper.toDto(user, {}) },
        this.config.secretKey,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = this.uuidv4();

      return this.emit(LOGIN_SUCCESS, { accessToken, refreshToken });
    } catch (error) {
      return this.emit(ERROR, LOGIN_ERROR_MSG);
    }
  }

  // async refreshToken(refreshToken) {
  //   const { REFRESH_TOKEN_SUCCESS, INVALID_TOKEN, INVALID_INPUT, ERROR } =
  //     this.outputs;

  //   try {
  //     if (!refreshToken) {
  //       return this.emit(INVALID_INPUT, INVALID_REFRESH_TOKEN_ERROR_MSG);
  //     }

  //     const accessToken = this.jwt.verify(
  //       refreshToken,
  //       this.config.secretKey,
  //       (error, user) => {
  //         if (error) {
  //           return false;
  //         }

  //         return this.jwt.sign(
  //           { id: user.id, isEnabled: user.isEnabled },
  //           this.config.secretKey,
  //           {
  //             expiresIn: "1h",
  //           }
  //         );
  //       }
  //     );

  //     if (!accessToken) {
  //       return this.emit(INVALID_TOKEN, INVALID_REFRESH_TOKEN_ERROR_MSG);
  //     }

  //     return this.emit(REFRESH_TOKEN_SUCCESS, { accessToken });
  //   } catch (error) {
  //     return this.emit(ERROR, REFRESH_TOKEN_ERROR_MSG);
  //   }
  // }
}

UserService.setOutputs([
  "ADD_USER_SUCCESS",
  "LOGIN_SUCCESS",
  "REFRESH_TOKEN_SUCCESS",
  "CREATE_ACCOUNT_FAILED",
  "INVALID_EMAIL",
  "INVALID_PASSWORD",
  "INVALID_INPUT",
  "ERROR",
]);

module.exports = UserService;
