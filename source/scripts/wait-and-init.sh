#!/bin/sh

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
while ! nc -z db 3306; do
  sleep 1
done
echo "MySQL is ready"

# Initialize the database
echo "Initializing database..."
npm run init-db

# Start the application
echo "Starting application..."
npm run dev 