const path = require("path");
const sourcePath = path.resolve(__dirname, "../src");

module.exports = {
  mode: "none",
  target: "web",
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".json", ".scss", ".sass"],
    modules: ["node_modules", sourcePath],
    alias: {
      "@lib": sourcePath + "/lib",
      "@hooks": sourcePath + "/hooks",
      "@config": sourcePath + "/config",
      "@actions": sourcePath + "/actions",
      "@plugins": sourcePath + "/plugins",
      "@layouts": sourcePath + "/layouts",
      "@contexts": sourcePath + "/contexts",
      "@components": sourcePath + "/components",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                modules: false,
              },
            ],
            "@babel/preset-react",
          ],
          plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-proposal-export-default-from",
          ],
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: false,
              localIdentName: "[local]__[hash:base64:6]",
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: "file-loader",
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024,
            },
          },
        ],
      },
    ],
  },
};
