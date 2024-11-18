import { Pool, PoolConfig } from "pg";
import { config } from "dotenv";

config(); // Load environment variables

const poolConfig: PoolConfig = {
  connectionString: process.env.POSTGRES_PRISMA_URL,
  ssl: {
    rejectUnauthorized: false, // Required for NeonDB
  },
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new Pool(poolConfig);

// Function to test connection with retries
async function testConnection(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log("Database connected successfully");
      client.release();
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
  query: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return result.rows;
  },
};

export default pool;
