var path = require('path');
var _ = require('underscore');

// complete possible missing key in config
function complete(config) {
  config = _.defaults(config, {
    ws: {},
    db: {}
  });

  config.ws = _.defaults(config.ws, {
    url: undefined,
    realm: undefined,
    authId: undefined,
    password: undefined
  });
}

// overwrite static config by runtime options
function overwrite(config, options) {
  _.each(options, function(value, key) {
    var splittedKey = key.split('-');
    switch (splittedKey.length) {
    case 1:
      config[splittedKey[0]] = value;
      break;
    case 2:
      try {
        config[splittedKey[0]][splittedKey[1]] = value;
      } catch (err) {
        throw new Error('invalid option: ' + key);
      }
      break;
    default:
      throw new Error('invalid option: ' + key);
    }
  });
}

// return the first key whose value is undefined
function getUndefinedField(object) {
  return _.findKey(object, function(value) {
    return _.isUndefined(value);
  });
}

/**
 * config: static, parsed from a config file
 * runOptions: runtime arguments that complete the config
 */
function build(runOptions) {
  var config;
  try {
    config = require(path.resolve(process.env.PWD, 'config/config.json'));
  } catch (err) {
    throw new Error('config file not found !');
  }

  complete(config);
  overwrite(config, runOptions);

  var undefKey = getUndefinedField(config);
  if (!_.isUndefined(undefKey)) {
    throw new Error('missing config key: config.' + undefKey);
  }

  undefKey = getUndefinedField(config.ws);
  if (!_.isUndefined(undefKey)) {
    throw new Error('missing config key: config.ws.' + undefKey);
  }

  return config;
}

module.exports.build = build;
