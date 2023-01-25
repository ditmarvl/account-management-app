const UserMapper = {
  toEntity(email, password, firstName, lastName, isEnabled) {
    return {
      email,
      password,
      firstName,
      lastName,
      isEnabled,
    };
  },

  toDto(user, account) {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEnabled: user.isEnabled,
      accountId: account.id,
    };
  },
};

module.exports = UserMapper;
