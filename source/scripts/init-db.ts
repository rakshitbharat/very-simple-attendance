#!/usr/bin/env ts-node
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import type { User } from "@prisma/client";

// Add type declarations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DB_HOST?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;
    }
  }
}

const prisma = new PrismaClient();

interface AdminUser {
  email: string;
  name: string;
  password: string;
  is_admin: boolean;
  ptp: string;
  ptp_verified: boolean;
}

async function testDatabaseConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query("SELECT NOW()");
    console.log("Direct database connection test successful");
  } catch (error) {
    console.error("Direct database connection test failed:", error);
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log("Starting database initialization...");
  console.log("Database URL:", process.env.DATABASE_URL);

  try {
    await testDatabaseConnection();
    await prisma.$connect();
    console.log("Database connection successful!");

    // Check if admin user exists
    console.log("Checking for existing admin user...");
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@admin.com" },
    });

    if (!existingAdmin) {
      console.log("No admin user found. Creating new admin user...");
      const adminUser: AdminUser = {
        email: "admin@admin.com",
        name: "Admin User",
        password: "admin@admin.com",
        is_admin: true,
        ptp: "1234",
        ptp_verified: true,
      };

      const createdUser = await prisma.user.create({
        data: adminUser,
      });
      console.log("Admin user created successfully:", {
        id: createdUser.id,
        email: createdUser.email,
        is_admin: createdUser.is_admin,
        password: createdUser.password,
      });
    } else {
      console.log("Admin user already exists:", {
        id: existingAdmin.id,
        email: existingAdmin.email,
        is_admin: existingAdmin.is_admin,
        password: existingAdmin.password,
      });

      // Update existing admin password if needed
      await prisma.user.update({
        where: { email: "admin@admin.com" },
        data: { password: "admin@admin.com" },
      });
      console.log("Admin password updated");
    }

    // Verify users in database
    console.log("Verifying users in database...");
    const allUsers = await prisma.user.findMany();
    console.log("Total users in database:", allUsers.length);
    console.log(
      "Users:",
      allUsers.map((user: User) => ({
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        password: user.password,
      }))
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    console.log("Closing database connection...");
    await prisma.$disconnect();
    console.log("Database connection closed.");
  }
}

main().catch((error) => {
  console.error("Error in main function:", error);
  process.exit(1);
});
