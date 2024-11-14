require("dotenv").config();
const mysql = require("mysql2/promise");

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to database successfully");

    // Add your database initialization logic here

    await connection.end();
    console.log("Database initialization completed");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

main();
