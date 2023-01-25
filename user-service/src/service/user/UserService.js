const Operation = require("../Operation");

const {
  ADD_USER_ERROR_MSG,
  INVALID_INPUT_ERROR_MSG,
  INVALID_EMAIL_ERROR_MSG,
  USER_NOT_FOUND_ERROR_MSG,
  GET_USER_ERROR_MSG,
  GET_USERS_ERROR_MSG,
  DUPLICATE_KEY_ERROR_MSG,
} = require("../../constants/errorMessages");

class UserService extends Operation {
  constructor({ logger, userRepository, userMapper, bcrypt, secrets }) {
    super();
    this.logger = logger;
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.bcrypt = bcrypt;
    this.saltRounds = secrets.saltRounds;
  }

  async createUser(email, password, firstName, lastName) {
    const {
      ADD_USER_SUCCESS,
      INVALID_INPUT,
      INVALID_EMAIL,
      DUPLICATE_KEY,
      ERROR,
    } = this.outputs;

    try {
      if (!email || !password || !firstName || !lastName) {
        return this.emit(INVALID_INPUT, INVALID_INPUT_ERROR_MSG);
      }

      // Regex for validating email
      if (!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return this.emit(INVALID_EMAIL, INVALID_EMAIL_ERROR_MSG);
      }

      const hashedPassword = await this.bcrypt.hash(password, this.saltRounds);

      const userEntity = await this.userRepository.createUser(
        email,
        hashedPassword,
        firstName,
        lastName
      );

      return this.emit(ADD_USER_SUCCESS, this.userMapper.toDto(userEntity));
    } catch (error) {
      if (error.code === 11000) {
        this.logger.warn(DUPLICATE_KEY_ERROR_MSG, {
          data: {
            errorMessage: error.toString(),
            inputParameters: JSON.stringify({
              email,
              password,
              firstName,
              lastName,
            }),
          },
        });

        return this.emit(DUPLICATE_KEY, DUPLICATE_KEY_ERROR_MSG);
      }

      this.logger.error(ADD_USER_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ firstName, lastName }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, ADD_USER_ERROR_MSG);
    }
  }

  async getUserById(id) {
    const { GET_USER_SUCCESS, USER_NOT_FOUND, ERROR } = this.outputs;

    try {
      const user = await this.userRepository.getUserById(id);

      if (user) {
        return this.emit(GET_USER_SUCCESS, this.userMapper.toDto(user));
      }

      this.logger.debug(USER_NOT_FOUND_ERROR_MSG, {
        data: {
          inputParameters: JSON.stringify({ id }),
        },
      });

      return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
    } catch (error) {
      this.logger.error(GET_USER_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ id }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_USER_ERROR_MSG);
    }
  }

  async getAllUsers() {
    const { GET_ALL_USERS_SUCCESS, ERROR } = this.outputs;

    try {
      const users = await this.userRepository.getAllUsers();

      if (!users) {
        return this.emit(GET_ALL_USERS_SUCCESS, []);
      }

      return this.emit(
        GET_ALL_USERS_SUCCESS,
        users.map((user) => this.userMapper.toDto(user))
      );
    } catch (error) {
      this.logger.error(GET_USERS_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          stack: error.stack,
        },
      });
      return this.emit(ERROR, GET_USERS_ERROR_MSG);
    }
  }

  async updateUser(id, userData) {
    const {
      UPDATE_USER_SUCCESS,
      INVALID_EMAIL,
      DUPLICATE_KEY,
      USER_NOT_FOUND,
      ERROR,
    } = this.outputs;
    const { email, password, firstName, lastName, isEnabled } = userData;

    try {
      // Regex for validating email
      if (!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return this.emit(INVALID_EMAIL, INVALID_EMAIL_ERROR_MSG);
      }

      const hashedPassword = await this.bcrypt.hash(password, this.salt);

      const user = await this.userRepository.updateUser(id, {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isEnabled,
      });

      if (!user) {
        this.logger.debug(USER_NOT_FOUND_ERROR_MSG, {
          data: {
            inputParameters: JSON.stringify({ id }),
          },
        });

        return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
      }

      return this.emit(UPDATE_USER_SUCCESS, this.userMapper.toDto(user));
    } catch (error) {
      if (error.code === 11000) {
        this.logger.warn(DUPLICATE_KEY_ERROR_MSG, {
          data: {
            errorMessage: error.toString(),
            inputParameters: JSON.stringify({
              id,
              email,
              firstName,
              lastName,
              isEnabled,
            }),
          },
        });

        return this.emit(DUPLICATE_KEY, DUPLICATE_KEY_ERROR_MSG);
      }

      this.logger.error(GET_USER_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ id }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_USER_ERROR_MSG);
    }
  }

  async deleteUserById(id) {
    const { DELETE_USER_SUCCESS, USER_NOT_FOUND, ERROR } = this.outputs;

    try {
      const user = await this.userRepository.deleteUserById(id);

      if (!user) {
        return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
      }

      return this.emit(DELETE_USER_SUCCESS, {
        message: "User deleted successfully",
        user: this.userMapper.toDto(user),
      });
    } catch (error) {
      this.logger.error(GET_USERS_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_USERS_ERROR_MSG);
    }
  }

  async getUserByEmail(email) {
    const { GET_USER_SUCCESS, USER_NOT_FOUND, ERROR } = this.outputs;

    try {
      const user = await this.userRepository.getUserByEmail(email);

      if (user) {
        return this.emit(GET_USER_SUCCESS, user);
      }

      this.logger.debug(USER_NOT_FOUND_ERROR_MSG, {
        data: {
          inputParameters: JSON.stringify({ email }),
        },
      });

      return this.emit(USER_NOT_FOUND, USER_NOT_FOUND_ERROR_MSG);
    } catch (error) {
      this.logger.error(GET_USER_ERROR_MSG, {
        data: {
          errorMessage: error.toString(),
          inputParameters: JSON.stringify({ email }),
          stack: error.stack,
        },
      });

      return this.emit(ERROR, GET_USER_ERROR_MSG);
    }
  }
}

UserService.setOutputs([
  "ADD_USER_SUCCESS",
  "GET_ALL_USERS_SUCCESS",
  "UPDATE_USER_SUCCESS",
  "DELETE_USER_SUCCESS",
  "INVALID_INPUT",
  "INVALID_EMAIL",
  "GET_USER_SUCCESS",
  "USER_NOT_FOUND",
  "DUPLICATE_KEY",
  "ERROR",
]);

module.exports = UserService;
