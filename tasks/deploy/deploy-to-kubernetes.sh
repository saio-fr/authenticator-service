#! /bin/bash

# install kubernetes client
if [ ! -d ~/kubernetes ]; then
  export KUBERNETES_VERSION=1.0.3
  mkdir ~/kubernetes
  curl -L https://github.com/kubernetes/kubernetes/releases/download/v${KUBERNETES_VERSION}/kubernetes.tar.gz > /tmp/kubernetes.tar.gz
  tar xzvf /tmp/kubernetes.tar.gz -C ~
  rm -f /tmp/kubernetes.tar.gz
  chmod +x ~/kubernetes/cluster/kubectl.sh
fi

# create rc config
mkdir tasks/deploy/build
chmod +x tasks/deploy/create-authenticator-controller.yml.sh && tasks/deploy/create-authenticator-controller.yml.sh

# export kubectl parameters
export KUBERNETES_KUBECTL=~/kubernetes/cluster/kubectl.sh
export KUBERNETES_CMD="$KUBERNETES_KUBECTL --server=${KUBERNETES_SERVER} --username=${KUBERNETES_USERNAME} --password=${KUBERNETES_PASSWORD} --insecure-skip-tls-verify=true"

$KUBERNETES_CMD config set-context staging --namespace=staging --cluster=saio-fr_kubernetes --user=saio-fr_kubernetes
$KUBERNETES_CMD config set-context production --namespace=production --cluster=saio-fr_kubernetes --user=saio-fr_kubernetes

# Switch k8 namespaces (prod, staging...) based on current branch
if [ "$CIRCLE_BRANCH" = "develop" ]; then
    echo 'Using staging namespace'
    $KUBERNETES_CMD config use-context staging
fi

if [ "$CIRCLE_BRANCH" = "master" ]; then
    echo 'Using production namespace'
    $KUBERNETES_CMD config use-context production
fi

if [ $($KUBERNETES_CMD get rc | grep -c authenticator) -ne 1 ]; then
    echo "Create authenticator rc"
    $KUBERNETES_CMD create -f tasks/deploy/build/authenticator-controller.yml
else
    echo "Rolling update authenticator rc"
    $KUBERNETES_CMD rolling-update authenticator --update-period=10s --image=${EXTERNAL_REGISTRY_ENDPOINT}/authenticator:${CIRCLE_BRANCH}_${CIRCLE_SHA1}
fi
