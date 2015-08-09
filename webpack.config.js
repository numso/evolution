/* @flow */

module.exports = {

  entry: {
    'bundle.js': './client/app/index.js'
  },

  output: {
    path: 'client/build/',
    filename: '[name]'
  },

  resolve: {
    extensions: ['', '.js', 'index.js']
  },

  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json'}
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel?stage=0', exclude: [/node_modules/] }
    ],
    postLoaders: [
      { test: /\.js$/, loader: 'transform?brfs' }
    ]
  }

}
