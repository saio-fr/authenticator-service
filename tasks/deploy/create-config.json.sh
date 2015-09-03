#!/bin/bash
rm -f config/config.json

if [ "$CIRCLE_BRANCH" = "develop" ]; then
    export CROSSBAR_URL="ws://crossbar.staging.cluster.local"
fi

if [ "$CIRCLE_BRANCH" = "master" ]; then
    export CROSSBAR_URL="ws://crossbar.production.cluster.local"
fi

cat > config/config.json <<EOF

{
  "ws": {
    "url": $CROSSBAR_URL,
    "domain": "fr.saio.service",
    "realm": "saio",
    "authId": "service",
    "password": "service"
  }
}

EOF
