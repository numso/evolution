/* @flow */

var os = require('os')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')

var config = require('../webpack-dev.config')

var port = 3000

new WebpackDevServer(webpack(config), config.devServer)
  .listen(port, '0.0.0.0', function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('HMR Static Server listening at http://' + os.hostname() + ':' + port)
  })
