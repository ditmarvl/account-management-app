const CardMapper = {
  toEntity(firstName, lastName, number, expDate, cvv) {
    return {
      firstName,
      lastName,
      number,
      expDate,
      cvv,
    };
  },

  toDto(card) {
    return {
      id: card.id,
      firstName: card.firstName,
      lastName: card.lastName,
      number: card.number,
      expDate: card.expDate,
      cvv: card.cvv,
      accountId: card.accountId,
    };
  },
};

module.exports = CardMapper;
