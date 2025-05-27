#!/bin/bash

# Exit on error
set -e

# Clone the dist branch of the repository
echo "Cloning the repository..."
git clone --branch dist https://github.com/ssveronis/Gallery-Website.git
cd Gallery-Website

# Install dependencies
echo "Installing dependencies..."
npm install

# Prompt for environment variables
echo "Please enter the following environment variables:"

read -p "PORT: " PORT
read -p "DOMAIN: " DOMAIN
read -p "DB_USER: " DB_USER
read -p "DB_PASS: " DB_PASS
read -p "DB_HOST: " DB_HOST
read -p "DB_PORT: " DB_PORT
read -p "DB_NAME: " DB_NAME
read -p "MAIL_HOST: " MAIL_HOST
read -p "MAIL_PORT: " MAIL_PORT
read -p "MAIL_USER: " MAIL_USER
read -p "MAIL_PASS: " MAIL_PASS

# Write to .env file
cat <<EOF > .env
PORT=$PORT
DOMAIN=$DOMAIN
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
MAIL_HOST=$MAIL_HOST
MAIL_PORT=$MAIL_PORT
MAIL_USER=$MAIL_USER
MAIL_PASS=$MAIL_PASS
EOF

echo ".env file created successfully."

# Ask for user's email
read -p "Enter your email for setup: " EMAIL

# Run setup
echo "Running setup..."
npm run setup -- "$EMAIL"