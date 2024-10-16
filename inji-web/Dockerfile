# Use an official Node.js runtime as the base image
FROM node:14 as build

# Set the working directory in the container
WORKDIR /app

# Set a build-time environment variable (replace YOUR_ENV_VARIABLE_NAME with the desired variable name)
ARG defaultTheme
ARG defaultLang
ARG defaultFavicon
ARG defaultTitle

ENV DEFAULT_THEME=$defaultTheme
ENV DEFAULT_LANG=$defaultLang
ENV DEFAULT_FAVICON=$defaultFavicon
ENV DEFAULT_TITLE=$defaultTitle

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Clean your cache
RUN npm cache clean --force
# Rebuild npm
RUN npm rebuild
# Reinstall node_modules
RUN rm -rf node_modules

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use an official Nginx image as the final production image
FROM nginx:latest

# Add the ARGs as environment variables
ARG SOURCE
ARG COMMIT_HASH
ARG COMMIT_ID
ARG BUILD_TIME

# Copy labels from build stage
LABEL source=${SOURCE}
LABEL commit_hash=${COMMIT_HASH}
LABEL commit_id=${COMMIT_ID}
LABEL build_time=${BUILD_TIME}


ARG container_user=mosip

# can be passed during Docker build as build time environment for github branch to pickup configuration from.
ARG container_user_group=mosip

# can be passed during Docker build as build time environment for github branch to pickup configuration from.
ARG container_user_uid=1001

# can be passed during Docker build as build time environment for github branch to pickup configuration from.
ARG container_user_gid=1001

ENV nginx_dir=/usr/share/nginx

ENV work_dir=${nginx_dir}/html

# set working directory for the user
WORKDIR /home/${container_user}

# install packages and create user
RUN groupadd -g ${container_user_gid} ${container_user_group} \
    && useradd -u ${container_user_uid} -g ${container_user_group} -s /bin/sh -m ${container_user} \
    && mkdir -p /var/run/nginx /var/tmp/nginx /temp \
    && chown -R ${container_user}:${container_user} /usr/share/nginx /var/run/nginx /var/tmp/nginx /temp


ADD configure_start.sh configure_start.sh

RUN chmod +x configure_start.sh

RUN echo "DEFAULT_THEME=$DEFAULT_THEME" >> ${work_dir}/env.env \
    && echo "DEFAULT_LANG=$DEFAULT_LANG" >> ${work_dir}/env.env \
    && echo "DEFAULT_FAVICON=$DEFAULT_FEVICON" >> ${work_dir}/env.env \
    && echo "DEFAULT_TITLE=$DEFAULT_TITLE" >> ${work_dir}/env.env

RUN chown -R ${container_user}:${container_user} /home/${container_user}

# change permissions of file inside working dir
RUN chown -R ${container_user}:${container_user} ${work_dir}

USER ${container_user_uid}:${container_user_gid}

# Copy the built React app from the build container to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 3004

ENTRYPOINT [ "./configure_start.sh" ]

# The main command to start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
