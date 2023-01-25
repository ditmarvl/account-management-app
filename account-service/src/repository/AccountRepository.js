class AccountRepository {
  constructor({ AccountModel, accountMapper, logger }) {
    this.AccountModel = AccountModel;
    this.accountMapper = accountMapper;
    this.logger = logger;
  }

  async createAccount(iban, currency, userId) {
    const accountEntity = this.accountMapper.toEntity(iban, currency, userId);

    const accountModelEntity = new this.AccountModel(accountEntity);

    const validationErrors = accountModelEntity.validateSync();
    if (validationErrors) {
      this.logger.error("Validation Error when creating account", {
        error: validationErrors,
      });

      throw validationErrors;
    }

    const entity = await this.AccountModel.create(accountModelEntity);

    this.logger.debug(`Successfully created account with id ${entity.id}`);

    return entity;
  }

  async getById(accountId) {
    const account = await this.AccountModel.findById(accountId);

    return account;
  }

  async getByUserId(userId) {
    const account = await this.AccountModel.findOne({ userId });

    return account;
  }

  async getByCardId(cardId) {
    const account = await this.AccountModel.findOne({ cardId });

    return account;
  }

  async decreaseBalance(accountId, amount) {
    const account = await this.AccountModel.findOneAndUpdate(
      { _id: accountId },
      { $inc: { balance: Math.abs(amount) * -1 } },
      {
        new: true,
      }
    );

    return account;
  }

  async increaseBalance(accountId, amount) {
    const account = await this.AccountModel.findOneAndUpdate(
      { _id: accountId },
      { $inc: { balance: Math.abs(amount) } },
      {
        new: true,
      }
    );

    return account;
  }

  async updateAccount(id, accountData) {
    const account = await this.AccountModel.findByIdAndUpdate(id, accountData, {
      new: true,
    });

    return account;
  }

  async deleteAccountById(id) {
    const account = await this.AccountModel.findByIdAndDelete(id);

    return account;
  }
}

module.exports = AccountRepository;
