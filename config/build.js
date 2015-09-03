var _ = require('underscore');
var path = require('path');

var buildConfig = function(options) {
  var config = {};

  if (_.isUndefined(options)) {
    options = {};
  }

  try {
    config = require(path.join(process.env.PWD, 'config/config.json'));
  } catch (e) {
    throw new Error('config file not found !');
  }

  // default config: merge options in config for authURI, crossbarAuthURI, ws/db/logger
  config = _.defaults(config, {
    ws: {},
    db: {},
    logger: {},
    auth: {}
  });

  config.ws = _.defaults(config.ws, {
    domain: options['ws-domain'],
    url: options['ws-url'],
    realm: options['ws-realm'],
    authId: options['ws-authId'],
    password: options['ws-password']
  });

  return config;
};

module.exports = buildConfig;
