#!/bin/bash
set -e

# Create pg_hba.conf with MD5 authentication
cat > /etc/postgresql/pg_hba.conf << EOF
local   all             all                                     trust
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
host    all             all             all                     md5
EOF

# Create the attendance database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
    SELECT 'CREATE DATABASE attendance'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'attendance')\gexec

    ALTER USER postgres WITH PASSWORD 'postgres';
EOSQL

# Connect to the attendance database and set up permissions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname attendance <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE attendance TO postgres;
    GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
EOSQL

# Reload PostgreSQL configuration
pg_ctl reload