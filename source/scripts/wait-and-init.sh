#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL is ready"

# Initialize the database
echo "Initializing database..."
npm run init-db

# Start the application
echo "Starting application..."
npm run dev 