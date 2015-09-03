var autobahn = require('autobahn');
var when = require('when');
var tape = require('blue-tape');

var crossbarUrl = 'ws://192.168.99.100:8080';

tape('valid-token', function(t) {

  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWlvIiwiaWF0IjoxNDQxMjc1MDE0LCJleHAiOjE0NzI4MTEwMTUsImF1ZCI6IjU0ODA1M2M5YTE4ZTIiLCJzdWIiOiI1NWU2ZGZlZGQ0ZGE0IiwibGljZW5jZSI6IjU0ODA1M2M5YTE4ZTIiLCJyb2xlcyI6IlsgICAgIFwiUk9MRV9BRE1JTlwiLCAgICAgXCJST0xFX1VTRVJcIiAgIF0ifQ.d8E2aR97_sMAeqyiEswz64O43Iq5BJGLG7AAn6hnky0';

  function onchallenge(session, method, extra) {
    t.equal(method, 'ticket');
    return token;
  }

  var connection = new autobahn.Connection({
    url: crossbarUrl,
    realm: 'saio',

    authmethods: ['ticket'],
    authid: '',
    onchallenge: onchallenge
  });

  connection.onopen = function(session) {
    t.pass('auth was successful');
    connection.close();
  };

  connection.onclose = function(reason, details) {
    t.notEqual(details.reason, 'wamp.error.authorization_failed');
    t.end();
  };

  connection.open();
});

tape('invalid-token', function(t) {

  var token = 'eyJ0eXAiOi1QiLCJhbGciOiJIUzIiJ9.eyJpc3MiOiJzYWlvIiwiaWF0IjoxNDQxMjc1MDE0LCJleHAiOjE0NzI4MTEwMTUsImF1ZCI6IjU0ODA1M2M5YTE4ZTIiLCJzdWIiOiI1NWU2ZGZlZGQ0ZGE0IiwibGljZW5jZSI6IjU0ODA1M2M5YTE4ZTIiLCJyb2xlcyI6IltdIn0.O2gAjAoULpqR6xvmIAwghLpFZnydkD7IRd_R0ddv2Xs';

  function onchallenge(session, method, extra) {
    t.equal(method, 'ticket');
    return token;
  }

  var connection = new autobahn.Connection({
    url: crossbarUrl,
    realm: 'saio',

    authmethods: ['ticket'],
    authid: '',
    onchallenge: onchallenge
  });

  connection.onopen = function(session) {
    t.fail('auth was successful');
    connection.close();
  };

  connection.onclose = function(reason, details) {

    t.equal(details.reason, 'wamp.error.authorization_failed');
    t.end();
  };

  connection.open();
});


tape('invalid-realm', function(t) {

  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWlvIiwiaWF0IjoxNDQxMjc1MDE0LCJleHAiOjE0NzI4MTEwMTUsImF1ZCI6IjU0ODA1M2M5YTE4ZTIiLCJzdWIiOiI1NWU2ZGZlZGQ0ZGE0IiwibGljZW5jZSI6IjU0ODA1M2M5YTE4ZTIiLCJyb2xlcyI6IlsgICAgIFwiUk9MRV9BRE1JTlwiLCAgICAgXCJST0xFX1VTRVJcIiAgIF0ifQ.d8E2aR97_sMAeqyiEswz64O43Iq5BJGLG7AAn6hnky0';

  function onchallenge(session, method, extra) {
    t.equal(method, 'ticket');
    return token;
  }

  var connection = new autobahn.Connection({
    url: crossbarUrl,
    realm: 'saioooO',

    authmethods: ['ticket'],
    authid: '',
    onchallenge: onchallenge
  });

  connection.onopen = function(session) {
    t.fail('auth was successful');
  };

  connection.onclose = function(reason, details) {
    t.equal(details.reason, 'wamp.error.no_such_realm');
    t.end();
  };

  connection.open();
});
