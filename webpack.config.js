/* @flow */

module.exports = {

  entry: {
    'bundle.js': './client/app/index.js'
  },

  output: {
    path: 'client/build/',
    filename: '[name]'
  },

  node: {
    fs: 'empty'
  },

  resolve: {
    extensions: ['', '.js', '.jsx', 'index.js', 'index.jsx']
  },

  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json'}
    ],
    loaders: [
      { test: /\.jsx$/, loader: 'react-hot!babel?stage=0', exclude: [/node_modules/] },
      { test: /\.js$/, loader: 'babel?stage=0', exclude: [/node_modules/] }
    ]
  }

}
