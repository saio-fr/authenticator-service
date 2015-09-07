#!/bin/bash
cat > tasks/deploy/build/authenticator-controller.yml <<EOF

apiVersion: v1
kind: ReplicationController
metadata:
  name: authenticator
  labels:
    name: authenticator
    branch: ${CIRCLE_BRANCH}
    commit: ${CIRCLE_SHA1}
spec:
  replicas: ${REPLICAS_NUMBER}
  # selector identifies the set of pods that this
  # replication controller is responsible for managing
  selector:
    name: authenticator
    branch: ${CIRCLE_BRANCH}
  # template defines the 'cookie cutter' used for creating
  # new pods when necessary
  template:
    metadata:
      labels:
        # Important: these labels need to match the selector above
        # The api server enforces this constraint.
        name: authenticator
        branch: ${CIRCLE_BRANCH}
    spec:
      containers:
      - name: authenticator
        command: ["npm", "start", "--"]
        args: ["--ws-url", "ws://crossbar-private:8081"]
        image: eu.gcr.io/saio-fr/authenticator:${CIRCLE_BRANCH}_${CIRCLE_SHA1}
        ports:
          - containerPort: 8081

EOF
