const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const ROOT = path.resolve(__dirname, 'src/main');
const SRC = path.resolve(ROOT, 'js');
const DEST = path.resolve(__dirname, 'build/js');



module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      favicon: './favicon.png',
      template: './src/main/resources/templates/index.html'
    })
  ],
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    static: {
      directory: DEST,
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
  entry: {
    app: SRC + '/index.tsx',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  output: {
    path: DEST,
    filename: 'dist/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        include: [SRC],
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
        exclude: [SRC],
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
  }
};
