var autobahn = require('autobahn');
var when = require('when');
var tape = require('blue-tape');

var crossbarUrl = 'ws://localhost:8080';

tape('valid-token', function(t) {

  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWlvIiwiaWF0IjoxNDQxMjc1MDE0LCJhdWQiOiI1NDgwNTNjOWExOGUyIiwic3ViIjoiNTVlNmRmZWRkNGRhNCIsImxpY2VuY2UiOiI1NDgwNTNjOWExOGUyIiwicm9sZXMiOiJbICAgICBcIlJPTEVfQURNSU5cIiwgICAgIFwiUk9MRV9VU0VSXCIgICBdIn0.9skeoih66OxpXI0qq59j91eprc_4A6ImcVhB1Co6kXA';

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

  t.timeoutAfter(10000);
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
    t.equal(details.message, 'invalid token');
    t.end();
  };

  t.timeoutAfter(10000);
  connection.open();
});


tape('invalid-realm', function(t) {

  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWlvZCIsImlhdCI6MTQ0MTM2MTQxNiwiYXVkIjoiZHNxZHFkIiwic3ViIjoiZHNxZHFkIn0.kHO_QYRfV0HuiT_LReaMU48ArheUHBN4p69lyzRZ55c';

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
  };

  connection.onclose = function(reason, details) {
    t.equal(details.message, 'invalid issuer provided for that realm');
    t.end();
  };

  t.timeoutAfter(10000);
  connection.open();
});


tape('invalid-aud', function(t) {

  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWlvZCIsImlhdCI6MTQ0MTM2MTQxNiwiYXVkIjoiIiwic3ViIjoiZHNxZHFkIn0.EvPiPOjGrFEZYocldXnuEiNZdiG7Bu4zuXt9kFOn_mI';

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
  };

  connection.onclose = function(reason, details) {
    t.equal(details.message, 'invalid audience provided');
    t.end();
  };

  t.timeoutAfter(10000);
  connection.open();
});
