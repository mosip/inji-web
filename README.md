# Inji-Web
Injiweb is a web interface for users who does not have access to smartphone for accessing and using digital credentials. A user should be able to do primariliy 4 key actions - fetch, download, store, share.

---
# Installations:

Node 18 - Can be installed using [nvm](https://github.com/nvm-sh/nvm). Run following commands to install node

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
$ nvm install 18
```
---
# Configuration:
Inji web connects with a backend-for-frontend service called Mimoto. URLs to connect with this service can be updated in the config file by running the following command:
```
$ nano ./inji-web/src/utils/config.js
```
Once the config file is updated run following commands to save the updates:

`ctrl + o` and then `y` to save the changes

`ctrl + x` to exit

---

# Folder Structure:

  * **helm:** folder contains helm charts required to deploy on K8S

  * **inji-web:** contains the source code and Dockerfile

---
# Updating Mimoto Host

In the api.ts file, modify the **mimotoHost** to url pointing to the mimoto service running  

---


# Running Inji Web:

* Run following commands to start the application:

```
$ cd ./inji-web
$ npm install
$ npm start
```
 * Run `npm test` to run tests


- Build and run Docker for a service:
```
$ cd ./inji-web
$ docker build -f Dockerfile.local -t <dockerImageName>:<tag> .
$ docker run -p 3004:3004 <dockerImageName>:<tag>
```

- Run Using Docker Compose 
```
$ cd ./inji-web
$ docker-compose up
```

- Stop Using Docker Compose
```
$ cd ./inji-web
$ docker-compose down
```

- You can access the application in the below nginx server :  
> Open URL http://localhost:81

