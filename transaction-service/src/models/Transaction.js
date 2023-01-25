const { Schema } = require("mongoose");

module.exports = new Schema(
  {
    fromFirstName: {
      type: String,
      required: true,
      autopopulate: false,
    },
    fromLastName: {
      type: String,
      required: true,
      autopopulate: false,
    },
    fromIban: {
      type: Schema.Types.String,
      required: true,
      autopopulate: false,
    },
    toFirstName: {
      type: String,
      required: true,
      autopopulate: false,
    },
    toLastName: {
      type: String,
      required: true,
      autopopulate: false,
    },
    toIban: {
      type: Schema.Types.String,
      required: true,
      autopopulate: false,
    },
    amount: {
      type: Number,
      required: true,
      autopopulate: false,
    },
    currency: {
      type: String,
      required: true,
      autopopulate: false,
    },
    reason: {
      type: String,
      required: true,
      autopopulate: false,
    },
  },
  {
    timestamps: true,
  }
);
