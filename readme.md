## Authenticator service

Authenticator is our auth service based on jsonwebtoken (JWT).

JWTs are generated on our frontend servers (php right now, node in future) and set on client side in cookies & local storage.

A typical JWT payload before encoding looks like:
```
{
  "iss": "saio", // issuer, default to saio
  "iat": 1441275014, // created at
  "exp": 1472811015, // expire at
  "aud": "548053c9a18e2", // our uniq user identifier
  "licence": "548053c9a18e2", // user's client licence id
  "roles": "[]" // user's roles
}
```

When users want to authenticate, they challenge our crossbar router with a ticket auth:

```
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...';

function onchallenge(session, method, extra) {
  if (method === 'token')
    return token;
}

var connection = new autobahn.Connection({
  url: 'ws://crossbar:8080',
  realm: 'saio',

  authmethods: ['ticket'], // important part
  authid: '', // can be null
  onchallenge: onchallenge
});
```
If the token provided is valid, they will be authentificate as ***registered*** user. Else, the ws connection will be closed.

### How to test
For simple units testing, simply run:
```
npm test
```

For integration testing, do the folloing:
```
sh tasks/crossbar/start.sh
sh tasks/test.sh
sh tasks/crossbar/stop.sh // to clean docker
```

Be carefull of putting a correct crossbarUrl in config/config.json according to your environment:
```
Mac: your docker ip provided by boot2docker,
Linux: localhost,
Kubernetes: crossbar service dns
```

This will create a crossbar router, register our authenticator service at 'fr.saio.service.authenticate', create a virtual client and then run integration tests.

### How to deploy
Simply commit or pr in develop branch for staging environment, or master for production.

This will automatically build & push containers in our kubernetes cluster.
