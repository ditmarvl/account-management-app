const TransactionMapper = {
  toEntity(transaction) {
    return transaction;
  },

  toDto(transaction) {
    return transaction;
  },

  mapTransaction(transaction) {
    return {
      created: transaction.createdAt,
      amount: transaction.sign + transaction.amount.toString(),
    };
  },

  toTransactionHistory(account, transactions) {
    const sendTransactions = transactions.filter(
      (t) => t.fromIban === account.iban
    );

    const receivedTransactions = transactions.filter(
      (t) => t.toIban === account.iban
    );
    // eslint-disable-next-line no-return-assign, no-param-reassign
    sendTransactions.forEach((t) => (t.sign = "-"));
    // eslint-disable-next-line no-return-assign, no-param-reassign
    receivedTransactions.forEach((t) => (t.sign = "+"));

    const sortedResult = [...sendTransactions, ...receivedTransactions].sort(
      (a, b) => a.createdAt > b.createdAt
    );

    return sortedResult.map((t) => this.mapTransaction(t));
  },
};

module.exports = TransactionMapper;
