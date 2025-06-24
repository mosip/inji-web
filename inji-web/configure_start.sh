#!/bin/sh

echo "generating env-config file"

workingDir=$nginx_dir/html
echo "window._env_ = {" > ${workingDir}/env.config.js
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ${workingDir}/env.env >> ${workingDir}/env.config.js
echo "}" >> ${workingDir}/env.config.js

echo "generation of env-config file completed!"

exec "$@"
