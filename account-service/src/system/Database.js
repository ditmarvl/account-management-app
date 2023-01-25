const mongoose = require("mongoose");
const path = require("path");
const ModelsLoader = require("./ModelsLoader");

module.exports = ModelsLoader.load({
  mongoose,
  baseFolder: path.join(__dirname, "../models"),
});
