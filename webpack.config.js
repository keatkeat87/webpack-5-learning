const pathHelper = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./index.js",
  },
  output: {
    path: pathHelper.resolve(__dirname, "dist"),
  },
};
