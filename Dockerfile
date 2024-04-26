# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Update and install curl and other necessary tools
RUN apt-get update && apt-get install -y curl

# Install Node.js using NVM
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.12
RUN mkdir -p $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Make nvm script available in the current shell session
SHELL ["/bin/bash", "--login", "-c"]

# Install Node.js and set it as the default version
RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default

# Install PNPM using npm
RUN npm install -g pnpm

# Set up environment for runtime
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Create /root/project directory
RUN mkdir -p /root/project

# Set the working directory
WORKDIR /root/project

# Copy your project into the container
COPY plasmo-migrate /root/project/.
