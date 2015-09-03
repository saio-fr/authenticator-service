sleep 2
echo 'Make sure crossbar is running & a valid crossbarUrl is specified in test/authenticator.test.integration.js'
node_modules/.bin/service-runner src/main.js &
sleep 2
echo 'Running integration tests'
node_modules/.bin/blue-tape test/**/*.test.integration.js | node_modules/.bin/tap-spec
