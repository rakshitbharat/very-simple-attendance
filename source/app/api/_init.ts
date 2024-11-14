import { getConnection } from "@/lib/mysql";

// Initialize MySQL connection
const initDb = async () => {
  try {
    const connection = await getConnection();
    // Test the connection
    await connection.ping();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    // Retry logic
    setTimeout(initDb, 5000);
  }
};

// Start initialization
initDb();

// Export the getConnection function instead of prisma instance
export { getConnection };
