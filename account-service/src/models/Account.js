const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    iban: {
      type: String,
      required: true,
      autopopulate: false,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      autopopulate: false,
    },
    currency: {
      type: String,
      required: true,
      autopopulate: false,
    },
    isEnabled: {
      type: String,
      required: true,
      autopopulate: false,
    },
    userId: {
      type: String,
      required: true,
      autopopulate: false,
    },
  },
  {
    timestamps: true,
  }
);
