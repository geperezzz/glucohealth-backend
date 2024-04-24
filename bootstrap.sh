#!/bin/bash

# Abort if any command fails
set -e

# Apply the database migrations
npx drizzle-kit push:pg

# Start the app
npm run start:prod