# Deployment

## Pre-requisites
* Base infrastructure setup
    * Tool and utilities to be installed locally [steps](https://docs.inji.io/readme/setup/deploy#tools-and-utilities)
    * System Requirements: Hardware, network and certificate requirements [steps](https://docs.inji.io/readme/setup/deploy#system-requirements)
    * Set up Wireguard Bastion Host [steps](https://docs.inji.io/readme/setup/deploy#wireguard)
    * K8s Cluster setup [steps](https://docs.inji.io/readme/setup/deploy#k8-cluster-setup)
    * NGINX setup and configuration [steps](https://docs.inji.io/readme/setup/deploy#nginx-for-inji-k8-cluster)
    * K8s Cluster Configuration [steps](https://docs.inji.io/readme/setup/deploy#k8-cluster-configuration)
* inji-stack-config ConfigMap [steps](https://docs.inji.io/readme/setup/deploy#pre-requisites)
* Config server secerts [steps](https://github.com/mosip/mosip-infra/tree/v1.2.0.2/deployment/v3/mosip/conf-secrets)
* Config server installation [steps](https://docs.inji.io/readme/setup/deploy#config-server-installation)
* Object store installation [steps](https://github.com/mosip/mosip-infra/tree/v1.2.0.2/deployment/v3/external/object-store)

## Installing DataShare and injiweb
```
./install.sh
```

Note: After installing inji web and datashare, ensure that the active_profile_env parameter in the config-map of the config-server-share is correctly set to: default,inji-default,standalone.