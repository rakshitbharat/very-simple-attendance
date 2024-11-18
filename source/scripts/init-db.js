require("dotenv").config();
const { Pool } = require("pg");

async function main() {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to database successfully");

    // Add your database initialization logic here
    await pool.query("SELECT NOW()");

    await pool.end();
    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

main();
