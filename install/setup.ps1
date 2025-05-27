# Exit on any error
$ErrorActionPreference = "Stop"

# Clone the repository from the dist branch
Write-Host "Cloning the repository..."
git clone --branch dist https://github.com/ssveronis/Gallery-Website.git
Set-Location Gallery-Website

# Install npm dependencies
Write-Host "Installing dependencies..."
npm install

# Prompt user for environment variables
Write-Host "Please enter the following environment variables:"

$PORT = Read-Host "PORT"
$DOMAIN = Read-Host "DOMAIN"
$DB_USER = Read-Host "DB_USER"
$DB_PASS = Read-Host "DB_PASS"
$DB_HOST = Read-Host "DB_HOST"
$DB_PORT = Read-Host "DB_PORT"
$DB_NAME = Read-Host "DB_NAME"
$MAIL_HOST = Read-Host "MAIL_HOST"
$MAIL_PORT = Read-Host "MAIL_PORT"
$MAIL_USER = Read-Host "MAIL_USER"
$MAIL_PASS = Read-Host "MAIL_PASS"

# Create .env file
@"
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
"@ | Out-File -Encoding UTF8 .env

Write-Host ".env file created successfully."

# Prompt for email
$email = Read-Host "Enter your email for setup"

# Run setup command
Write-Host "Running setup..."
npm run setup -- $email