#!/bin/bash

if command -v git &> /dev/null; then
  git pull
fi

set -e

# Ensure .cache Folder is Created
if [ ! -d ".cache" ]; then
  mkdir .cache
fi

# Add Docker repo, only if not done already
if [ ! -f ".cache/is-docker-repo-added" ]; then
  yum install -y yum-utils
  yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  touch .cache/is-docker-repo-added
fi

# Install EPEL-release
yum install -y epel-release

# Install NEEDED Packages
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin nodejs npm

# Install DESIRED Packages
yum install -y vim net-tools screen

# Start and enable docker
if [ ! -f ".cache/is-docker-enabled" ]; then
  systemctl start docker
  systemctl enable docker
  touch .cache/is-docker-enabled
else
  systemctl restart docker
fi

npm install

# Setup all
npm run setup:all
