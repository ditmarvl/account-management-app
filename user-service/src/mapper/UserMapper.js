const UserMapper = {
  toEntity(email, password, firstName, lastName) {
    return {
      email,
      password,
      firstName,
      lastName,
      isEnabled: true,
    };
  },

  toDto(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEnabled: user.isEnabled,
    };
  },
};

module.exports = UserMapper;
