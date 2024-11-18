import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export interface User {
  id: number;
  email: string;
  name: string | null;
  is_admin: boolean;
  ptp: string | null;
  ptp_verified?: boolean;
}

export async function validateAuth(email: string, ptp?: string) {
  try {
    console.log("Validating auth for:", email, "PTP:", ptp);

    const result = await pool.query(
      `SELECT id, email, name, is_admin, ptp, ptp_verified 
       FROM users 
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      console.log("No user found in database");
      return null;
    }

    if (!user.is_admin) {
      if (!ptp || ptp !== user.ptp) {
        console.log("PTP mismatch or missing - authentication failed");
        return null;
      }
    }

    console.log("Auth successful for:", email);
    return user;
  } catch (error) {
    console.error("Auth validation error:", error);
    return null;
  }
}

export async function validateCredentials(email: string, password: string) {
  try {
    console.log("Validating credentials for:", email); // Debug log

    const [rows] = await pool.query(
      `SELECT id, email, name, password, is_admin, ptp, ptp_verified 
       FROM users 
       WHERE email = ?`,
      [email]
    );

    console.log("Database response rows:", rows); // Debug log

    // Handle array result
    const users = Array.isArray(rows) ? rows : [rows];
    const user = users[0];

    if (!user) {
      console.log("User not found");
      return null;
    }

    console.log("Found user:", {
      id: user.id,
      email: user.email,
      password: user.password,
      providedPassword: password,
    }); // Debug log

    // Simple password comparison (since we're storing plain text for this mock)
    if (user.password !== password) {
      console.log("Password mismatch");
      return null;
    }

    console.log("Credentials validated successfully"); // Debug log

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin === 1, // Convert to boolean
      ptp: user.ptp,
      ptp_verified: user.ptp_verified === 1, // Convert to boolean
    };
  } catch (error) {
    console.error("Error validating credentials:", error);
    return null;
  }
}

export async function generatePTP(): Promise<string> {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
