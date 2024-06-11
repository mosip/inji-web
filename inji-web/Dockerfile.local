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

# Set environment variables
ENV nginx_dir=/usr/share/nginx
ENV work_dir=${nginx_dir}/html

# Create env-config file
RUN echo "Generating env-config file" \
    && echo "window._env_ = {" > ${work_dir}/env.config.js \
    && echo "DEFAULT_THEME=\"$DEFAULT_THEME\"," >> ${work_dir}/env.config.js \
    && echo "DEFAULT_LANG=\"$DEFAULT_LANG\"," >> ${work_dir}/env.config.js \
    && echo "DEFAULT_FAVICON=\"$DEFAULT_FAVICON\"," >> ${work_dir}/env.config.js \
    && echo "DEFAULT_TITLE=\"$DEFAULT_TITLE\"" >> ${work_dir}/env.config.js \
    && echo "}" >> ${work_dir}/env.config.js \
    && echo "Generation of env-config file completed!"

# Copy the built React app from the build container to the Nginx container
COPY --from=build /app/build ${work_dir}

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 3004

# The main command to start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
