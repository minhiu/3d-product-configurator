const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
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
    ],
  },
  mode: "production",
};
