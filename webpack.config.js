const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
           limit: 100000,
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['css-loader']
      },
      {
        test: /\.(scss)$/,
        use: [
      {
            loader: 'css-loader', // translates CSS into CommonJS modules
          }, {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                   return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              }
          }, {
            loader: 'sass-loader' // compiles Sass to CSS
          }
	]
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.ProvidePlugin({
       process: 'process/browser.js'
    }),
    new webpack.ProvidePlugin({
       Buffer: ['buffer','Buffer'],
    }),
  ],
  resolve: {
     fallback: {
        "util": require.resolve("util/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/"),
     },
     alias: {
        process: "process/browser.js"
     },
  },
  output: {
    publicPath: '/',
    filename: 'index.js',
    hashFunction: 'md5',
  }
};
