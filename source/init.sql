CREATE DATABASE attendance_system;
\c attendance_system;

-- Drop tables if they exist
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  ptp CHAR(4),
  ptp_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  clock_in TIMESTAMP NOT NULL,
  clock_out TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert admin user
INSERT INTO users (email, password, name, is_admin, ptp, ptp_verified) 
VALUES ('admin@admin.com', 'admin123', 'Admin User', TRUE, '1234', TRUE);

-- Verify admin user creation
SELECT 'Verifying admin user:' as message, 
       COUNT(*) as admin_count,
       STRING_AGG(email, ', ') as emails
FROM users;