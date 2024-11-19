#!/bin/sh
set -e

echo "Installing dependencies..."
npm install

echo "Waiting for database to be ready..."
until pg_isready -h db -U postgres; do
  echo "Database is not ready - sleeping"
  sleep 1
done

echo "Database is ready - executing commands"

echo "Generating Prisma Client..."
npx prisma generate

echo "Pushing database schema..."
npx prisma db push --accept-data-loss

echo "Initializing database..."
npx ts-node --project tsconfig.json scripts/init-db.ts

echo "Starting application..."
exec npm run dev 