#!/bin/bash
# Installs inji-web helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=injiweb
CHART_VERSION=0.10.0-develop
DATASHARE_CHART_VERSION=1.3.0-beta.1

DEFAULT_MOSIP_INJIWEB_HOST=$( kubectl get cm global -n config-server -o jsonpath={.data.mosip-injiweb-host} )
# Check if MOSIP_INJIWEB_HOST is present under configmap/global of configserver
if echo "$DEFAULT_MOSIP_INJIWEB_HOST" | grep -q "MOSIP_INJIWEB_HOST"; then
    echo "MOSIP_INJIWEB_HOST is already present in configmap/global of configserver"
    MOSIP_INJIWEB_HOST=DEFAULT_MOSIP_INJIWEB_HOST
else
    read -p "Please provide injiwebhost (eg: injiweb.sandbox.xyz.net ) : " MOSIP_INJIWEB_HOST

    if [ -z "MOSIP_INJIWEB_HOST" ]; then
    echo "INJIWEB Host not provided; EXITING;"
    exit 0;
    fi    
fi   

CHK_MOSIP_INJIWEB_HOST=$( nslookup "$MOSIP_INJIWEB_HOST" )
if [ $? -gt 0 ]; then
    echo "Injiweb Host does not exists; EXITING;"
    exit 0;
fi

echo "MOSIP_INJIWEB_HOST is not present in configmap/global of configserver"
    # Add injiweb host to global
    kubectl patch configmap global -n config-server --type merge -p "{\"data\": {\"mosip-injiweb-host\": \"$MOSIP_INJIWEBB_HOST\"}}"
    kubectl patch configmap global -n default --type merge -p "{\"data\": {\"mosip-injiweb-host\": \"$MOSIP_INJIWEBB_HOST\"}}"
    # Add the host
    kubectl set env deployment/config-server SPRING_CLOUD_CONFIG_SERVER_OVERRIDES_MOSIP_INJIWEB_HOST=$MOSIP_INJIWEB_HOST -n config-server
    # Restart the configserver deployment
    kubectl -n config-server get deploy -o name | xargs -n1 -t kubectl -n config-server rollout status

DEFAULT_INJI_DATASHARE_HOST=$( kubectl get cm global -n config-server -o jsonpath={.data.mosip-inji-datashare-host} )
# Check if INJI_DATASHARE_HOST is present under configmap/global of configserver
if echo "$DEFAULT_INJI_DATASHARE_HOST" | grep -q "INJI_DATASHARE_HOST"; then
    echo "INJI_DATASHARE_HOST is already present in configmap/global of configserver"
    INJI_DATASHARE_HOST=DEFAULT_INJI_DATASHARE_HOST
else
    read -p "Please provide datashareinjihost (eg: datashare-inji.sandbox.xyz.net ) : " INJI_DATASHARE_HOST

    if [ -z "INJI_DATASHARE_HOST" ]; then
    echo "Datashareinji Host not provided; EXITING;"
    exit 0;
    fi    
fi

CHK_INJI_DATASHARE_HOST=$( nslookup "$INJI_DATASHARE_HOST" )
if [ $? -gt 0 ]; then
    echo "datashare-inji Host does not exists; EXITING;"
    exit 0;
fi

echo "INJI_DATASHARE_HOST is not present in configmap/global of configserver"
    # Add datashare-inji host to global
    kubectl patch configmap global -n config-server --type merge -p "{\"data\": {\"mosip-inji-datashare-host\": \"$MOSIP_INJI_DATASHARE_HOST\"}}"
    kubectl patch configmap global -n default --type merge -p "{\"data\": {\"mosip-inji-datashare-host\": \"$MOSIP_INJI_DATASHARE_HOST\"}}"
    # Add the host
    kubectl set env deployment/config-server SPRING_CLOUD_CONFIG_SERVER_OVERRIDES_MOSIP_MOSIP_INJI_DATASHARE_HOST=$MOSIP_INJI_DATASHARE_HOST -n config-server
    # Restart the configserver deployment
    kubectl -n config-server get deploy -o name | xargs -n1 -t kubectl -n config-server rollout status

echo Create $NS namespace
kubectl create ns $NS

function installing_inji-web() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  echo Copy configmaps
  ./copy_cm.sh

  INJI_DATASHARE_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-inji-datashare-host})
  echo Installing datashare
  helm -n $NS install datashare-inji mosip/datashare \
  -f datashare-values.yaml \
  --set istio.gateway.servers[0].hosts[0]=$INJI_DATASHARE_HOST \
  --version $CHART_VERSION

  INJI_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-injiweb-host})
  echo Installing INJIWEB
  helm -n $NS install injiweb mosip/injiweb \
  -f values.yaml \
  --set inji_web.configmaps.injiweb-ui.MIMOTO_HOST=https://$INJI_HOST/v1/mimoto \
  --set istio.hosts\[0\]=$INJI_HOST \
  --version $CHART_VERSION

  kubectl -n $NS  get deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed inji-web
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_inji-web   # calling function
