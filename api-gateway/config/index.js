const path = require("path");
const database = require("./database");

require("dotenv").config();

const ENV = process.env.NODE_ENV || "development";

// eslint-disable-next-line import/no-dynamic-require
const envConfig = require(path.join(__dirname, "environments", ENV));
const dbConfig = database[ENV];

const config = { [ENV]: true, env: ENV, db: dbConfig, ...envConfig };

module.exports = config;
