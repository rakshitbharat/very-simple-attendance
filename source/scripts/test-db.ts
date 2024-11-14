import pool from "../lib/db";

async function testConnection() {
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      "admin@admin.com",
    ]);
    console.log("Test query result:", rows);
  } catch (error) {
    console.error("Database test failed:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
