const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      autopopulate: false,
    },
    lastName: {
      type: String,
      required: true,
      autopopulate: false,
    },
    email: {
      type: String,
      required: true,
      autopopulate: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      autopopulate: false,
    },
    isEnabled: {
      type: Boolean,
      required: true,
      autopopulate: false,
    },
  },
  {
    timestamps: true,
  }
);
