const path = require('path');

/**
 * Plugins perform bundle optimizations, asset management, and injection of env variables.
 */

// Generates index.html in dist/ for app and automatically injects all generated bundles in this file.
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Extracts CSS into separate files: creates CSS file per JS file which contains CSS
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Minimizes CSS.
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction? 'production': 'development', // In production, code is minimized.
  entry: { // The entry property tells webpack where to start building its dependency graph; defaults to `./src/index.js.
    index: './src/home/index.js',
    auth: './src/auth/index.js',
    app: './src/app/index.js',
  },
  output: { // Configures where bundles are emitted, and how to name them; defaults to ./dist/main.js and ./dist
    filename: './js/[name].[contenthash].bundle.js', // hash ensures new code is picked up when changes are made.
    // Webpack needs an absolute path to write our files.
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Cleans /dist before each build
  },
 devtool: isProduction? 'inline-source-map': undefined, // Allows trace stack error to point to correct error source file (avoid in production)
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'), // Allows the 'src' directory to be used as the top-level of an import statement.
    },
  },
  // Webpack understand JS and JSON by default. Loaders allow webpack to process other types of files and converts them to modules.
  module: {
    // Loaders are chained, applying in reverse (starting at last in array).
    rules: [
      { // 'test' identifies file(s) to be transformed; 'use' indicates which loader to transform with.
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // css-loader: interprets @import and url() like import/require() and resolves them. Applies before style-loader.
      },                                     // style-loader: injects CSS into the DOM: https://webpack.js.org/loaders/style-loader/
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // See: https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
          },
          'css-loader',
          'sass-loader',
        ],
      },
      { // Emit files to output directory. See: https://webpack.js.org/guides/asset-modules/
        test: /\.(jpg|jpeg|png|svg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: './img/[name][ext]'
        },
      },
      { // Transpile JS with Babel. See: https://webpack.js.org/loaders/babel-loader
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
            ],
          },
        },
      },
    ],
  },
  devServer: { // provided by webpack-dev-server package.
    static: './dist', // serve files from dist.
    port: 8080, // Default port.
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/home/index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'auth.html',
      template: 'src/auth/index.html',
      chunks: ['auth'],
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: 'src/app/index.html',
      chunks: ['app'],
    }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(isProduction ? 'your-prod-url': 'http://localhost:5000/api/v1'),
    }),
  ],
};
