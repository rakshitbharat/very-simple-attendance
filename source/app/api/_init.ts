import { Pool } from "pg";

// Initialize PostgreSQL connection
const initDb = async () => {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Test the connection
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    // Retry logic
    setTimeout(initDb, 5000);
  }
};

// Start initialization
initDb();

export { Pool as getConnection };
