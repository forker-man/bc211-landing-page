const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

// Loaders
const getLoaders = () => [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader'],
  },
  {
    test: /\.s[ac]ss$/i,
    use: ['style-loader', 'css-loader', 'sass-loader'],
  },
  {
    test: /\.css$/i,
    use: [MiniCssExtractPlugin.loader],
  },
  {
    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
    loader: 'url-loader?limit=100000',
  },
];

// Plugins
const getPlugins = (isDevelopment) => [
  new CleanWebpackPlugin(),
  new CopyPlugin(['public/chat-assets']),
  new HtmlWebpackPlugin({
    title: 'BC211 Landing Page',
    template: path.join(__dirname, 'public', 'index.html'),
  }),
  new MiniCssExtractPlugin({
    filename: isDevelopment ? '[name].css' : '[name].[hash].css',
    chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
  }),
];

// Inherited base configuration
const config = {
  entry: './src/index.js',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: getLoaders(),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
};

const prodConfig = {
  ...config,
  name: 'prod',
  mode: 'production',
  plugins: getPlugins(false),
  performance: { hints: false },
};

const devConfig = {
  ...config,
  name: 'dev',
  mode: 'development',
  plugins: getPlugins(true),
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    writeToDisk: true,
    host: HOST,
    port: PORT,
  },
};

module.exports = [prodConfig, devConfig];
