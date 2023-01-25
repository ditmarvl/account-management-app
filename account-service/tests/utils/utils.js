/* eslint-disable no-console */
const customLogger = {
  info: (title, data) => {
    console.log(title, data);
  },
  warn: (title, data) => {
    console.log(title, data);
  },
  error: (title, data) => {
    console.log(title, data);
  },
};

module.exports = {
  customLogger,
};
