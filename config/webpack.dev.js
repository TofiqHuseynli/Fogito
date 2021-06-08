const common = require("./webpack.common");
const path = require("path");
const rootPath = path.resolve(__dirname, "../");

module.exports = {
  ...common,
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "localhost",
    port: 4018,
    contentBase: rootPath + "/public",
    publicPath: "/",
    inline: true,
    compress: true,
    hot: true,
    historyApiFallback: true,
    watchContentBase: true,
  },
};
