var path = require('path');
var webpack = require('webpack')
var cssloader = require('css-loader')
var ROOT = path.resolve(__dirname, 'src/main/webapp');
var SRC  = path.resolve( ROOT, 'javascript');
var DEST = path.resolve( ROOT, 'dist');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: {
     app: SRC + '/index.jsx',
  },
  resolve: {
	  modules: [
		  "node_modules",
		  path.resolve(ROOT, 'javascript'),
		  path.resolve(ROOT, 'javascript/utils'),
		  path.resolve(ROOT, 'css')
	  ],
      extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [
	    new webpack.WatchIgnorePlugin([/css\.d\.ts$/])
  ],
  output: {
    path: DEST,
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
	    test: /\.jsx?$/,
        include: [SRC],
        loader: 'babel-loader',
		options: {
           presets: [ "@babel/env", "@babel/react" ]
		}
      },

      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { test: /\.css$/,
    	include: [SRC],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            // loader: 'typings-for-css-modules-loader',
            options: {
              camelCase: false,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              //namedExport: true
            }
          }
        ]
      },
      { test: /\.css$/, 
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
        },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  }
};
