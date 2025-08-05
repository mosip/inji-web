# injiweb ui

## Pre-requisites
* Cluster creation and configuration [steps](https://docs.inji.io/readme/setup/deploy)
* inji-stack-config configmap [steps](https://docs.inji.io/readme/setup/deploy#pre-requisites)
* Config server secerts [steps](https://github.com/mosip/mosip-infra/tree/v1.2.0.2/deployment/v3/mosip/conf-secrets)
* Config server installation [steps](https://docs.inji.io/readme/setup/deploy#config-server-installation)
* Object store installation [steps](https://github.com/mosip/mosip-infra/tree/v1.2.0.2/deployment/v3/external/object-store)

## Installing DataShare and injiweb
```
./install.sh
```

Note: After installing inji web and datashare, ensure that the active_profile_env parameter in the config-map of the config-server-share is correctly set to: default,inji-default,standalone.