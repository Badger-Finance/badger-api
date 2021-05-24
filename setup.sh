#!/bin/bash

set -euo pipefail

UBUNTU=
if [ "$OSTYPE" == "linux-gnu" ]; then
  UBUNTU=true
fi

# returns with exit code, 0 for true 1 for false
installed() {
  if [! command -v $1 &> /dev/null]; then
    return 1
  fi
  return 0
}

if ! installed "node"; then
  echo "Installing node..."
  if ! installed "nvm"; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    echo "Please complete the nvm installation and run setup.sh again"
    return 0
  fi
  nvm install node
  nvm use node
fi

if ! installed "yarn"; then
  npm install -g yarn
fi

if ! installed "serverless"; then
  npm install -g serverless
fi

yarn

if [ $UBUNTU ]; then
  sudo apt update
  sudo apt upgrade -y
  sudo apt install default-jdk -y
fi

sls dynamodb install
sls config credentials --provider aws --key x --secret x

echo "Successfully setup Badger API development environment!"
echo "Mock AWS security credentials have been set up for serverless - please update these if you have credentials."
echo "Run yarn dev to get started!"
exit
