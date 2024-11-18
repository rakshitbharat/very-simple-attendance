import { Pool } from "pg";
import inquirer from "inquirer";
import { table } from "table";
import chalk from "chalk";

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "attendance_system",
};

async function connectToDatabase() {
  try {
    const pool = new Pool(dbConfig);
    console.log(chalk.green("✓ Connected to database successfully"));
    return pool;
  } catch (error) {
    console.error(chalk.red("Error connecting to database:"), error);
    process.exit(1);
  }
}

async function displayUsers(pool) {
  try {
    const result = await pool.query("SELECT id, email FROM users");
    const rows = result.rows;

    if (rows.length === 0) {
      console.log(chalk.yellow("No users found in the database."));
      return [];
    }

    const tableData = [
      ["ID", "Email"],
      ...rows.map((user) => [user.id, user.email]),
    ];

    console.log("\nCurrent Users:");
    console.log(table(tableData));

    return rows;
  } catch (error) {
    console.error(chalk.red("Error fetching users:"), error);
    return [];
  }
}

function generatePTP() {
  // Generate a 4-digit number
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function resetPassword(pool, userId, newPassword) {
  try {
    const result = await pool.query("SELECT email FROM users WHERE id = $1", [
      userId,
    ]);
    const rows = result.rows;

    const ptp = generatePTP();

    await pool.query("UPDATE users SET password = $1, ptp = $2 WHERE id = $3", [
      newPassword,
      ptp,
      userId,
    ]);

    console.log(chalk.green("✓ Password reset successfully"));
    console.log(chalk.blue("You can now log in to the web interface"));
    console.log(chalk.yellow("\nPTP (4-digit code):"));
    console.log(chalk.yellow(ptp));
  } catch (error) {
    console.error(chalk.red("Error resetting password:"), error);
    throw error;
  }
}

async function createUser(pool, email, password) {
  try {
    const ptp = generatePTP();

    await pool.query(
      "INSERT INTO users (email, password, ptp) VALUES ($1, $2, $3)",
      [email, password, ptp]
    );

    console.log(chalk.green("✓ User created successfully"));
    console.log(chalk.blue("You can now log in to the web interface"));
    console.log(chalk.yellow("\nPTP (4-digit code):"));
    console.log(chalk.yellow(ptp));
  } catch (error) {
    if (error.code === "23505") {
      console.error(chalk.red("Error: Email already exists"));
    } else {
      console.error(chalk.red("Error creating user:"), error);
    }
    throw error;
  }
}

async function setupDatabase(pool) {
  try {
    // Modify PTP column to be exactly 4 characters
    await pool.query(`
      ALTER TABLE users ALTER COLUMN ptp TYPE CHAR(4)
    `);
    console.log(chalk.green("✓ Database schema updated successfully"));
  } catch (error) {
    console.error(
      chalk.yellow("Warning: Could not update database schema"),
      error
    );
  }
}

async function main() {
  let pool;

  try {
    pool = await connectToDatabase();
    await setupDatabase(pool);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Reset User Password", value: "reset" },
          { name: "Create New User", value: "create" },
        ],
      },
    ]);

    if (action === "create") {
      const { email, password } = await inquirer.prompt([
        {
          type: "input",
          name: "email",
          message: "Enter user email:",
          validate: (input) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input)) {
              return "Please enter a valid email address";
            }
            return true;
          },
        },
        {
          type: "password",
          name: "password",
          message: "Enter password:",
          validate: (input) => {
            if (input.length < 6) {
              return "Password must be at least 6 characters long";
            }
            return true;
          },
        },
      ]);

      await createUser(pool, email, password);
    } else {
      const users = await displayUsers(pool);

      if (users.length === 0) {
        return;
      }

      const { userId } = await inquirer.prompt([
        {
          type: "list",
          name: "userId",
          message: "Select a user to reset password:",
          choices: users.map((user) => ({
            name: `${user.email}`,
            value: user.id,
          })),
        },
      ]);

      const { newPassword } = await inquirer.prompt([
        {
          type: "password",
          name: "newPassword",
          message: "Enter new password:",
          validate: (input) => {
            if (input.length < 6) {
              return "Password must be at least 6 characters long";
            }
            return true;
          },
        },
      ]);

      await resetPassword(pool, userId, newPassword);
    }
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      console.log(chalk.blue("Database connection closed"));
    }
  }
}

// Run the script
main().catch(console.error);
