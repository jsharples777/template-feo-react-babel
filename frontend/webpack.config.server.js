const path = require('path');

module.exports = {
  mode: 'development',
  resolve: {
    fallback: {
      "url": false,
      "stream": false,
      "zlib": false
    }
  },
  entry: {
    app: ['./public/js/App.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../backend/public/js'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
    },
  }
};
