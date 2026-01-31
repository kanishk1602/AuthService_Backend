#!/bin/bash

# Create .env file for auth service
cat > .env << EOF
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/auth-service

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Configuration (optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=4000
EOF

echo "Created .env file for auth service"
echo "Please update the JWT_SECRET and SESSION_SECRET with secure values"
echo "For Google OAuth, add your Google Client ID and Secret" 