#!/bin/bash
# Copy configmaps from other namespaces
# DST_NS: Destination namespace 

function copying_cm() {
  COPY_UTIL=./copy_cm_func.sh
  DST_NS=injiweb

  $COPY_UTIL configmap inji-stack-config default $DST_NS
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
copying_cm   # calling function
