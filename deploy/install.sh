#!/bin/bash
# Installs inji-web helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=injiweb
CHART_VERSION=0.13.0
DATASHARE_CHART_VERSION=1.3.0-beta.2
##The value of INJI_DATASHARE_HOST is set to a fixed value: "datashare-inji.injiweb".
INJI_DATASHARE_HOST="datashare-inji.injiweb"

DEFAULT_INJIWEB_HOST=$( kubectl get cm inji-stack-config -n config-server -o jsonpath={.data.injiweb-host} )
# Check if INJIWEB_HOST is present under configmap/inji-stack-config of configserver
if echo "$DEFAULT_INJIWEB_HOST" | grep -q "INJIWEB_HOST"; then
    echo "INJIWEB_HOST is already present in configmap/inji-stack-config of configserver"
    MOSIP_INJIWEB_HOST=DEFAULT_INJIWEB_HOST
else
    read -p "Please provide injiwebhost (eg: injiweb.sandbox.xyz.net ) : " INJIWEB_HOST

    if [ -z "INJIWEB_HOST" ]; then
    echo "INJIWEB Host not provided; EXITING;"
    exit 0;
    fi
fi

CHK_INJIWEB_HOST=$( nslookup "$INJIWEB_HOST" )
if [ $? -gt 0 ]; then
    echo "Injiweb Host does not exists; EXITING;"
    exit 0;
fi

echo "INJIWEB_HOST is not present in configmap/inji-stack-config of configserver"
    # Add injiweb host to inji-stack-config
    kubectl patch configmap inji-stack-config -n config-server --type merge -p "{\"data\": {\"injiweb-host\": \"$INJIWEB_HOST\"}}"
    kubectl patch configmap inji-stack-config -n default --type merge -p "{\"data\": {\"injiweb-host\": \"$INJIWEB_HOST\"}}"
    # Add the host
    kubectl -n config-server set env --keys=injiweb-host --from configmap/inji-stack-config deployment/config-server --prefix=SPRING_CLOUD_CONFIG_SERVER_OVERRIDES_
    # Restart the configserver deployment
    kubectl -n config-server get deploy -o name | xargs -n1 -t kubectl -n config-server rollout status

DEFAULT_INJI_DATASHARE_HOST=$(kubectl get cm inji-stack-config -n config-server -o jsonpath={.data.inji-datashare-host})
if [ -z "$DEFAULT_INJI_DATASHARE_HOST" ]; then
    echo "Adding INJI_DATASHARE_HOST to config-server deployment"
    kubectl patch configmap inji-stack-config -n config-server --type merge -p "{\"data\": {\"inji-datashare-host\": \"$INJI_DATASHARE_HOST\"}}"
    kubectl patch configmap inji-stack-config -n default --type merge -p "{\"data\": {\"inji-datashare-host\": \"$INJI_DATASHARE_HOST\"}}"
    kubectl -n config-server set env --keys=inji-datashare-host --from configmap/inji-stack-config deployment/config-server --prefix=SPRING_CLOUD_CONFIG_SERVER_OVERRIDES_
    kubectl -n config-server get deploy -o name | xargs -n1 -t kubectl -n config-server rollout status
fi

echo "Creating $NS namespace"
kubectl create ns $NS

function installing_inji-web() {
echo "Labeling namespace for Istio"
kubectl label ns $NS istio-injection=enabled --overwrite

helm repo add mosip https://mosip.github.io/mosip-helm
helm repo update

./copy_cm.sh

INJI_DATASHARE_HOST=$(kubectl get cm inji-stack-config -o jsonpath={.data.inji-datashare-host})
echo "Installing datashare"
helm -n $NS install datashare-inji mosip/datashare \
  -f datashare-values.yaml \
  --version $DATASHARE_CHART_VERSION

INJI_HOST=$(kubectl get cm inji-stack-config -o jsonpath={.data.injiweb-host})
echo "Installing INJIWEB"
helm -n $NS install injiweb mosip/injiweb \
  --set inji_web.configmaps.injiweb-ui.MIMOTO_URL=https://$INJIWEB_HOST/v1/mimoto \
  --set istio.hosts[0]=$INJIWEB_HOST \
  --version $CHART_VERSION

kubectl -n $NS get deploy -o name | xargs -n1 -t kubectl -n $NS rollout status

echo "Installed inji-web"
return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_inji-web   # calling function
