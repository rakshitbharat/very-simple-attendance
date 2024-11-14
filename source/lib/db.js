const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "attendance_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
}

// Initialize connection
testConnection();

module.exports = pool;
