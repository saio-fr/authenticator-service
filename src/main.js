var path = require('path');
var _ = require('underscore');
var when = require('when');
var wsocket = require('@saio/wsocket-component');
var jwt = require('jsonwebtoken');

var Config = require('./config.js');

//var Logger = require('@saio/logger-component');

var Authenticator = function(container, options) {
  var config = Config.build(options);

  this.domain = config.ws.domain;

  this.ws = container.use('ws', wsocket, config.ws);
  this.secret = 'C1F164C84C89C51E57A7BD8FBDA36';

  //this.logger = container.use('logger', Logger, config.logger);
};

Authenticator.prototype.start = function() {

  var that = this;

  var authenticate = function(args) {

    var realm = args[0];
    var authid = args[1];
    var ticket = args[2];

    try {
      console.log(that.domain + '.authenticate', args);
      return that.authenticate(realm, authid, ticket);
    } catch (err) {
      console.error(err.stack);
      throw err.message;
    }
  };

  var register = this.ws.register(this.domain + '.authenticate', authenticate, { invoke: 'roundrobin' });

  return when(register)
    .then(function() {
      // TODO log start
      console.log('authorizer started');
      return when.resolve();
    });
};

Authenticator.prototype.stop = function() {
  return this.ws.unregister()
    .then(function() {
      // TODO log stop
      console.log('authorizer stopped');
      return when.resolve();
    });
};

Authenticator.prototype.authenticate = function(realm, authid, ticket) {

  try {
    var decoded = jwt.verify(ticket, this.secret);

    if (!decoded.aud) {
      throw new Error('invalid audience provided');
    } else {
      var aud = decoded.aud;
    }

    if (decoded.iss != realm) {
      throw new Error('invalid issuer provided for that realm');
    }

    var role = (!_.isEmpty(decoded.roles)) ? 'registered' : 'anonymous';

    return {
      authid: aud,
      role: role
    };
  } catch (err) {
    // err
    throw err;
  }
};

module.exports = Authenticator;
