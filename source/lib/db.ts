import { Pool, PoolConfig } from "pg";
import { config } from "dotenv";

config(); // Load environment variables

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new Pool(poolConfig);

// Helper functions for common queries
export const db = {
  // Generic query executor
  query: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return result.rows;
  },

  // Common attendance queries
  attendance: {
    findMany: async ({
      where = {},
      take,
      orderBy,
      include = {},
    }: {
      where?: any;
      take?: number;
      orderBy?: any;
      include?: any;
    } = {}) => {
      let sql = "SELECT a.*, u.name, u.email FROM attendance a";
      const values: any[] = [];
      let paramCount = 1;

      if (include.users) {
        sql += " LEFT JOIN users u ON a.user_id = u.id";
      }

      if (where.user_id) {
        sql += ` WHERE a.user_id = $${paramCount++}`;
        values.push(where.user_id);
      }

      if (where.clock_in?.gte) {
        sql += values.length ? " AND" : " WHERE";
        sql += ` a.clock_in >= $${paramCount++}`;
        values.push(where.clock_in.gte);
      }

      if (where.clock_in?.lte) {
        sql += values.length ? " AND" : " WHERE";
        sql += ` a.clock_in <= $${paramCount++}`;
        values.push(where.clock_in.lte);
      }

      if (orderBy?.clock_in) {
        sql += ` ORDER BY a.clock_in ${
          orderBy.clock_in === "desc" ? "DESC" : "ASC"
        }`;
      }

      if (take) {
        sql += ` LIMIT $${paramCount++}`;
        values.push(take);
      }

      const result = await pool.query(sql, values);
      return result.rows;
    },

    count: async (where: any = {}) => {
      let sql = "SELECT COUNT(*) as count FROM attendance";
      const values: any[] = [];
      let paramCount = 1;

      if (where.clock_in?.gte) {
        sql += ` WHERE clock_in >= $${paramCount++}`;
        values.push(where.clock_in.gte);
      }

      if (where.clock_out === null) {
        sql += values.length ? " AND" : " WHERE";
        sql += " clock_out IS NULL";
      }

      const result = await pool.query(sql, values);
      return parseInt(result.rows[0].count);
    },
  },

  // Common user queries
  users: {
    count: async () => {
      const result = await pool.query("SELECT COUNT(*) as count FROM users");
      return parseInt(result.rows[0].count);
    },
  },
};

// Test the connection
pool
  .connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

export default pool;
