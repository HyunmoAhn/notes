const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..');
const CONFIG_PATH = path.resolve(ROOT_PATH, 'config');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

const ENV = process.env.NODE_ENV || 'development';
const IS_PROD = ENV === 'production';

module.exports = {
  entry: path.join(SRC_PATH, 'index.jsx'),
  output: {
    filename: IS_PROD ? '[name].[contenthash:8].js' : '[name].[hash].js',
    path: BUILD_PATH,
    publicPath: '/',
  },
  mode: IS_PROD ? 'production' : 'development',
  devtool: IS_PROD ? undefined : 'cheap-module-eval-source-map',
  devServer: {
    contentBase: BUILD_PATH,
    compress: true,
    port: 8080,
    host: '0.0.0.0',
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: SRC_PATH,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(CONFIG_PATH, 'babel.config.js'),
              cacheDirectory: !IS_PROD,
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              configFile: path.resolve(CONFIG_PATH, '.eslintrc'),
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]--[hash:base64:5]',
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(ROOT_PATH, 'index.html'),
      inject: 'body',
    }),
  ],
  resolve: {
    alias: {
      '@': SRC_PATH,
    },
    extensions: ['.js', '.jsx'],
  },
};
