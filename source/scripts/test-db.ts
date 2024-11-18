import pool from "../lib/db";

async function testConnection() {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      "admin@admin.com",
    ]);
    console.log("Test query result:", result.rows);
  } catch (error) {
    console.error("Database test failed:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
