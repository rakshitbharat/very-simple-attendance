#!/bin/sh

set -e

until npx prisma migrate status > /dev/null 2>&1; do
  echo "Waiting for the database to be ready..."
  sleep 1
done

echo "Database is ready. Running Prisma commands..."

npx prisma generate
npx prisma migrate deploy
npx prisma db pull

exec "$@"