import mysql from "mysql2/promise";

//getConnection
export const getConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "attendance_system",
  });
};

// Create connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "attendance_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper functions for common queries
export const db = {
  // Generic query executor
  query: async (sql: string, values?: any[]) => {
    const [rows] = await pool.execute(sql, values);
    return rows;
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

      if (include.users) {
        sql += " LEFT JOIN users u ON a.user_id = u.id";
      }

      if (where.user_id) {
        sql += " WHERE a.user_id = ?";
        values.push(where.user_id);
      }

      if (where.clock_in?.gte) {
        sql += values.length ? " AND" : " WHERE";
        sql += " a.clock_in >= ?";
        values.push(where.clock_in.gte);
      }

      if (where.clock_in?.lte) {
        sql += values.length ? " AND" : " WHERE";
        sql += " a.clock_in <= ?";
        values.push(where.clock_in.lte);
      }

      if (orderBy?.clock_in) {
        sql += ` ORDER BY a.clock_in ${
          orderBy.clock_in === "desc" ? "DESC" : "ASC"
        }`;
      }

      if (take) {
        sql += " LIMIT ?";
        values.push(take);
      }

      return db.query(sql, values);
    },

    count: async (where: any = {}) => {
      let sql = "SELECT COUNT(*) as count FROM attendance";
      const values: any[] = [];

      if (where.clock_in?.gte) {
        sql += " WHERE clock_in >= ?";
        values.push(where.clock_in.gte);
      }

      if (where.clock_out === null) {
        sql += values.length ? " AND" : " WHERE";
        sql += " clock_out IS NULL";
      }

      const [result]: any = await db.query(sql, values);
      return result.count;
    },
  },

  // Common user queries
  users: {
    count: async () => {
      const [result]: any = await db.query(
        "SELECT COUNT(*) as count FROM users"
      );
      return result.count;
    },
  },
};

export default pool;
