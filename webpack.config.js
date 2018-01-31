const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './web/src/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: './web/src/index.js',
  output: {
    path: path.join(__dirname, 'web/public'),
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'], exclude: /node_modules/ }
    ]
  },
  devtool: 'sourcemap',
  plugins: [HtmlWebpackPluginConfig]
}
