class UserRepository {
  constructor({ UserModel, userMapper, logger }) {
    this.UserModel = UserModel;
    this.userMapper = userMapper;
    this.logger = logger;
  }

  async createUser(email, password, firstName, lastName) {
    const userEntity = this.userMapper.toEntity(
      email,
      password,
      firstName,
      lastName
    );

    const userModelEntity = new this.UserModel(userEntity);

    const validationErrors = userModelEntity.validateSync();
    if (validationErrors) {
      this.logger.error("Validation Error when saving User", {
        error: validationErrors,
      });
    }

    const entity = await this.UserModel.create(userModelEntity);

    this.logger.info(`Successfully created user with id ${entity.id}`);

    return entity;
  }

  async getUserById(id) {
    const user = await this.UserModel.findById(id);

    return user;
  }

  async getAllUsers() {
    const filter = {};
    const users = await this.UserModel.find(filter);

    return users;
  }

  async updateUser(id, userData) {
    const user = await this.UserModel.findByIdAndUpdate(id, userData, {
      new: true,
    });

    return user;
  }

  async deleteUserById(id) {
    const user = await this.UserModel.findByIdAndDelete(id);

    return user;
  }

  async getUserByEmail(email) {
    const user = await this.UserModel.findOne({ email });

    return user;
  }
}

module.exports = UserRepository;
