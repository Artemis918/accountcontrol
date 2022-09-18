const path = require('path');
const webpack = require('webpack');
const ROOT = path.resolve(__dirname, 'src/main');
const SRC  = path.resolve( ROOT, 'js');
const DEST = path.resolve( __dirname , 'build/js');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    static: {
      directory: DEST,
    },
    compress: true,
    port: 9000,
    proxy: { '/' : 'http://localhost:8080' }
  },
  entry: {
     app: SRC + '/index.tsx',
  },
  resolve: {
	  modules: [
		  "node_modules",
		  path.resolve(ROOT, 'js'),
		  path.resolve(ROOT, 'js/utils'),
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
         loader: "ts-loader"
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
