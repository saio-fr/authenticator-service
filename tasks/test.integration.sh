# start crossbar
docker build -t wsocket-crossbar-test tasks/integration ;
docker run -d \
  --name wsocket-crossbar-test \
  -p 0.0.0.0:8080:8080 \
  -p 0.0.0.0:8081:8081 \
  wsocket-crossbar-test;
sleep 5;

sleep 2
echo 'Make sure crossbar is running & a valid crossbarUrl is specified in test/authenticator.test.integration.js'
node_modules/.bin/service-runner src/main.js &
sleep 2
echo 'Running integration tests'
node_modules/.bin/blue-tape test/**/*.test.integration.js | node_modules/.bin/tap-spec
