import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
  entry: path.resolve(__dirname, "./src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".sass"],
  },
  devServer: {
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "ascifun",
    }),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "./ascifuner"),
      outDir: path.resolve(__dirname, "./ascifuner/pkg"),
      forceMode: "production",
    }),
  ],
  experiments: {
    asyncWebAssembly: true,
  },
};
