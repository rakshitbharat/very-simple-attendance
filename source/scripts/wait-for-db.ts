import { Pool } from "pg";

const maxRetries = 10;
const retryInterval = 5000; // 5 seconds

async function waitForDb() {
  let currentTry = 1;

  const pool = new Pool({
    host: process.env.DB_HOST || "db",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "attendance_system",
  });

  while (currentTry <= maxRetries) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      console.log("✓ Database connection successful");
      await pool.end();
      return;
    } catch (error) {
      console.log(`Database connection attempt ${currentTry} failed:`, error);
      if (currentTry === maxRetries) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      currentTry++;
    }
  }
}

waitForDb().catch((error) => {
  console.error("Fatal database connection error:", error);
  process.exit(1);
});
