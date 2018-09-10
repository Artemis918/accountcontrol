var path = require('path');
var webpack = require('webpack')
var ROOT = path.resolve(__dirname, 'src/main/webapp');
var SRC  = path.resolve( ROOT, 'javascript');
var DEST = path.resolve( ROOT, 'dist');

module.exports = {
  devtool: 'source-map',
  entry: {
     app: SRC + '/index.jsx',
  },
  resolve: {
	  modules: [
		  "node_modules",
		  path.resolve(ROOT, 'javascript'),
		  path.resolve(ROOT, 'css')
	  ]
  },
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
			presets: [ 'es2015','react']
		}
      },

      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.less$/, loader: 'style!css!less'},
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&amp;mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&amp;mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&amp;mimetype=image/svg+xml'}
    ]
  }
};
