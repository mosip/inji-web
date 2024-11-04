# Dockerfile
# Use the official Node.js image
FROM node:16.9.1

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the app runs
EXPOSE 3010

# Run the application
CMD ["node", "proxy_server.js"]
