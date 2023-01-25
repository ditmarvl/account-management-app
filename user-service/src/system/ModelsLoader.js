const fs = require("fs");
const path = require("path");

module.exports = {
  load({ mongoose, baseFolder, indexFile = "index.js" }) {
    const loaded = {};

    fs.readdirSync(baseFolder)
      .filter(
        (file) =>
          file.indexOf(".") !== 0 &&
          file !== indexFile &&
          file.slice(-3) === ".js"
      )
      .forEach(async (file) => {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const schema = require(path.join(baseFolder, file));
        const modelName = file.split(".")[0];
        loaded[modelName] = mongoose.model(modelName, schema);
      });

    loaded.database = mongoose;

    return loaded;
  },
};
