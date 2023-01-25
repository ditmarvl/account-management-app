class TransactionRepository {
  constructor({ TransactionModel, transactionMapper, logger }) {
    this.TransactionModel = TransactionModel;
    this.transactionMapper = transactionMapper;
    this.logger = logger;
    this.refreshTokens = [];
  }

  async createTransaction(transactionData) {
    const transactionEntity = this.transactionMapper.toEntity(transactionData);

    const transactionModelEntity = new this.TransactionModel(transactionEntity);

    const validationErrors = transactionModelEntity.validateSync();
    if (validationErrors) {
      this.logger.error("Validation Error when saving transaction", {
        error: validationErrors,
      });

      throw validationErrors;
    }

    const entity = await this.TransactionModel.create(transactionModelEntity);

    this.logger.info(`Successfully created transaction with id ${entity.id}`);

    return entity;
  }

  async getTransactionById(id) {
    const transaction = await this.TransactionModel.findById(id);

    return transaction;
  }

  async getTransactions(iban, from, to) {
    const fromDate = new Date(from).toISOString();
    const toDate = new Date(to).toISOString();

    const transactions = await this.TransactionModel.find({
      $or: [
        {
          toIban: iban,
          createdAt: { $gte: fromDate, $lte: toDate },
        },
        { fromIban: iban, createdAt: { $gte: fromDate, $lte: toDate } },
      ],
    });

    return transactions;
  }

  async updateTransaction(id, transactionData) {
    const transaction = await this.TransactionModel.findByIdAndUpdate(
      id,
      transactionData,
      {
        new: true,
      }
    );

    return transaction;
  }
}

module.exports = TransactionRepository;
