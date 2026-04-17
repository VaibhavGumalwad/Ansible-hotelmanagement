#!/bin/bash
# Script to update vulnerable npm packages

echo "Updating vulnerable npm packages..."

cd hotel-booking-frontend

# Update specific vulnerable packages
npm update underscore
npm update serialize-javascript  
npm update nth-check
npm update @tootallnate/once
npm update postcss
npm update webpack-dev-server

# Run npm audit to fix remaining vulnerabilities
npm audit fix --force

echo "Package updates completed. Please review package-lock.json for changes."