var autobahn = require('autobahn');
var when = require('when');
var tape = require('blue-tape');

var Authenticator = require('../src/main.js');

tape('registered', function(t) {

  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWlvIiwiYXVkIjoiNTQ4MDUzYzlhMThlMiIsImlhdCI6IjE0NDExOTM5NjUiLCJqdGkiOiI1NWU2ZGZlZGQ0ZGE0IiwibGljZW5jZSI6IjU0ODA1M2M5YTE4ZTIiLCJmaXJzdG5hbWUiOiJwcm9kIiwibGFzdG5hbWUiOiJwcm9kIiwiZW1haWwiOiJwcm9kQHNhaW8uZnIiLCJyb2xlcyI6WyJST0xFX0FETUlOIiwiUk9MRV9VU0VSIl19.tGDCg_wdBdDi5ov019npDHJVb5ZhWuJ6Cvn9vDYicyg';
  Authenticator.prototype.secret = 'secret';

  var result = Authenticator.prototype.authenticate('saio', null, token);

  t.notEqual(result, undefined);
  t.equal(result.authid, '548053c9a18e2');
  t.equal(result.role, 'registered');
  t.end();
});

tape('anonymous', function(t) {

  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWlvIiwiYXVkIjoiNTQ4MDUzYzlhMThlMiIsImlhdCI6IjE0NDExOTM5NjUiLCJqdGkiOiI1NWU2ZGZlZGQ0ZGE0IiwibGljZW5jZSI6IjU0ODA1M2M5YTE4ZTIiLCJmaXJzdG5hbWUiOiJwcm9kIiwibGFzdG5hbWUiOiJwcm9kIiwiZW1haWwiOiJwcm9kQHNhaW8uZnIiLCJyb2xlcyI6W119.QcgOFwV1WRoWLCKcGFG6u4d367NV7QZdAsKtcD4iqNY';
  Authenticator.prototype.secret = 'secret';

  var result = Authenticator.prototype.authenticate('saio', null, token);

  t.notEqual(result, undefined);
  t.equal(result.authid, '548053c9a18e2');
  t.equal(result.role, 'anonymous');
  t.end();
});


tape('invalid-token', function(t) {

  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MYWlvIiwiYXVkIjoiNTQ4MDUzYzlhMThlMiIsImlhdCI6IjE0NDExOTM5NjUiLCJqdGkiOiI1NWU2ZGZlZGQ0ZGE0IiwibGljZW5jZSI6IjU0ODA1M2M5YTE4ZTIiLCJmaXJzdG5hbWUiOiJwcm9kIiwibGFzdG5hbWUiOiJwcm9kIiwiZW1haWwiOiJwcm9kQHNhaW8uZnIiLCJyb2xlcyI6W119.QcgOFwV1WRoWLCKcGFG6u4d367NV7QZdAsKtcD4iqNY';
  Authenticator.prototype.secret = 'secret';

  var result = Authenticator.prototype.authenticate('saio', null, token);

  t.equal(result, undefined);
  t.end();
});

tape('invalid-realm', function(t) {

  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWlvb28iLCJhdWQiOiI1NDgwNTNjOWExOGUyIiwiaWF0IjoiMTQ0MTE5Mzk2NSIsImp0aSI6IjU1ZTZkZmVkZDRkYTQiLCJsaWNlbmNlIjoiNTQ4MDUzYzlhMThlMiIsImZpcnN0bmFtZSI6InByb2QiLCJsYXN0bmFtZSI6InByb2QiLCJlbWFpbCI6InByb2RAc2Fpby5mciIsInJvbGVzIjpbXX0.DZqvKJIHzT2igDCToDv4XO6haDZl_XI64au-dqKS4do';
  Authenticator.prototype.secret = 'secret';

  var result = Authenticator.prototype.authenticate('saio', null, token);

  t.equal(result, undefined);
  t.end();
});

tape('invalid-aud', function(t) {

  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzYWlvb28iLCJhdWQiOiIiLCJpYXQiOiIxNDQxMTkzOTY1IiwianRpIjoiNTVlNmRmZWRkNGRhNCIsImxpY2VuY2UiOiI1NDgwNTNjOWExOGUyIiwiZmlyc3RuYW1lIjoicHJvZCIsImxhc3RuYW1lIjoicHJvZCIsImVtYWlsIjoicHJvZEBzYWlvLmZyIiwicm9sZXMiOltdfQ.qFYLBg2YWwVg-7fPpJ0A2JVpiT2l7sGsgbZnJUJOQBk';
  Authenticator.prototype.secret = 'secret';

  var result = Authenticator.prototype.authenticate('saio', null, token);

  t.equal(result, undefined);
  t.end();
});
