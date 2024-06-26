USE very_simple_attendance;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  ptp VARCHAR(4)
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  clock_in DATETIME NOT NULL,
  clock_out DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert a sample admin user
INSERT INTO users (email, password, is_admin) VALUES ('admin@example.com', 'adminpassword', TRUE);
