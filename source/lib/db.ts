import mysql from "mysql2/promise";
import { PoolOptions, Pool } from "mysql2/promise";

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool: Pool = mysql.createPool(poolConfig);

// Function to test connection with retries
async function testConnection(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log("Database connected successfully");
      connection.release();
      return true;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to connect to database after multiple attempts");
}

// Initialize connection
testConnection().catch((err) => {
  console.error("Final connection error:", err);
  process.exit(1);
});

export const db = {
  query: async (sql: string, values: any[] = []) => {
    const [rows] = await pool.execute(sql, values);
    return rows;
  },
};

export default pool;
