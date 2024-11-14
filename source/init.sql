CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- Drop tables if they exist to avoid foreign key conflicts
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  ptp VARCHAR(4),
  ptp_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  clock_in TIMESTAMP NOT NULL,
  clock_out TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert admin user with a plain text password (admin123)
INSERT INTO users (email, password, name, is_admin, ptp, ptp_verified) 
VALUES ('admin@admin.com', 'admin123', 'Admin User', TRUE, '1234', TRUE);

-- Verify admin user creation
SELECT 'Verifying admin user:' as message, 
       COUNT(*) as admin_count,
       GROUP_CONCAT(email) as emails
FROM users;