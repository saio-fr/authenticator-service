#!/bin/bash
rm -f config/config.json

cat > config/config.json <<EOF
{
  "ws": {
    "url": "ws://crossbar-private:8081",
    "domain": "fr.saio.service",
    "realm": "saio",
    "authId": "service",
    "password": "service"
  }
}

EOF
