### Inji Web Proxy

Inji Web Proxy is express js application which is build to connect Backend Service From Inji Web to Avoid CORS issue.


### Environment Variables :

> MIMOTO_HOST : Update the host url of the Mimoto with **/v1/mimoto** suffix

> PORT : port in which proxy will run

### Installation Steps :

> npm i && node proxy_server.js

### Usage : 

- Goto InjiWeb [api.ts](../inji-web/src/utils/api.ts)
- In order to avoid CORS, update the **mimotoHost** of Inji Web from Mimoto service url to Inji Web Proxy server url, so that it proxies and bypasses the CORS
  - ref : https://localhost:3010
