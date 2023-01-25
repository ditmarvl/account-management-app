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
    number: {
      type: String,
      required: true,
      autopopulate: false,
      unique: true,
    },
    expDate: {
      type: String,
      required: true,
      autopopulate: false,
    },
    cvv: {
      type: Number,
      required: true,
      autopopulate: false,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      autopopulate: false,
    },
  },
  {
    timestamps: true,
  }
);
