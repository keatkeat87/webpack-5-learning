const pathHelper = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./index.ts",
  },
  output: {
    path: pathHelper.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
