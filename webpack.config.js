import path from "node:path";
import { fileURLToPath } from "node:url";
import "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const __root = path.resolve(__dirname, 'src/main');
const __src = './js';
const __srcpath = path.resolve(__dirname, __root + '/' + __src);
const __dest = path.resolve(__dirname, 'build/js');


export default {
  context: __root,
  mode: 'development',
  entry: {
    app: __src + '/index.tsx',
  },
  output: {
    filename: "bundle.js",
    path: __dest
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: __dirname + '/favicon.png',
      template: __src + '/index.html'
    })
  ],
  devtool: 'source-map',
  devServer: {
    static: {
      directory: __dest,
    },
    compress: true,
    port: 9000,
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:8080/',
      }
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        include: [__srcpath],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: [__srcpath],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
}
