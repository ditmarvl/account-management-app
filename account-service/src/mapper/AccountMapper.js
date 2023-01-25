const AccountMapper = {
  toEntity(iban, currency, userId) {
    return {
      iban,
      currency,
      isEnabled: true,
      userId,
      balance: 0,
    };
  },

  toDto(account) {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: account._id,
      iban: account.iban,
      currency: account.currency,
      isEnabled: account.isEnabled,
      userId: account.userId,
      balance: account.balance,
    };
  },
};

module.exports = AccountMapper;
