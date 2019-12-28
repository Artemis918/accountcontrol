const path = require('path');
const webpack = require('webpack');
const ROOT = path.resolve(__dirname, 'src/main/webapp');
const SRC  = path.resolve( ROOT, 'javascript');
const DEST = path.resolve( __dirname , 'build/js');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: {
     app: SRC + '/index.tsx',
  },
  resolve: {
	  modules: [
		  "node_modules",
		  path.resolve(ROOT, 'javascript'),
		  path.resolve(ROOT, 'javascript/utils'),
	  ],
      extensions: [".ts",".tsx",".js" ]
  },
  plugins: [
  ],
  output: {
    path: DEST,
    filename: 'dist/bundle.js',
  },
  module: {
    rules: [
      {
         test: /\.tsx?$/,
         loader: "awesome-typescript-loader"
      },
	  { test: /\.css$/,
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
      }
    ]
  }
};
