# --------------> The build image
# Use latest NodeJS server for the app
FROM node:latest AS build
# Place the dumb-init package install right after the build image declaration
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
# Specify app directory
WORKDIR /usr/src/app
# Install dependencies
COPY package*.json /usr/src/app/
# Build your code
RUN npm ci --only=production

# --------------> The production image
# Use recommended Node.js Docker image for the production build
FROM node:18.16.0-bullseye-slim
ENV NODE_ENV production
# Copy dumb-init package from the build Docker image into new production image
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
# USER Dockerfile directive ensures that the process is owned by the node user
USER node
# Specify app directory
WORKDIR /usr/src/app
# Copy node_modules folder from the build Docker image into new production image
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
# Bundle app source
COPY --chown=node:node . /usr/src/app
# Start up the app
CMD ["dumb-init", "node", "src/app.js"]
