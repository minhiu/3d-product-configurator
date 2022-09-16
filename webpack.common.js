const path = require("path");
const PACKAGE = require('./package.json');
const version = PACKAGE.version;

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: `main.js?v=${version}`,
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: "asset/resource",
            options: {
              outputPath: "assets/models/",
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
};
