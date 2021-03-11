const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    index: './src/iframe/index.js',
    popup: './src/popup/index.js',
    background: './src/pagescripts/background/index.js',
    highlight: './src/pagescripts/highlight/index.js',
    inject: './src/pagescripts/inject/index.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        loader: 'style-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // instead of style-loader
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/iframe/index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'src/popup/popup.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }],
      options: {
        concurrency: 100,
      },
    }),
    new MiniCssExtractPlugin(),
  ],
};
