import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    console.log("Received email header:", email);

    if (!email) {
      console.log("No email found in header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [adminCheck] = await db.query(
      "SELECT is_admin FROM users WHERE email = ?",
      [email]
    );

    console.log("Admin check result:", adminCheck);

    if (!adminCheck?.is_admin) {
      console.log("User is not admin:", email);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.query(
      `SELECT id, email, name, is_admin, ptp, ptp_verified 
       FROM users`
    );

    console.log("Fetched users count:", users.length);

    return NextResponse.json({
      success: true,
      users: users.map((user: any) => ({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        is_admin: user.is_admin === 1,
        ptp: user.ptp,
        ptp_verified: user.ptp_verified === 1,
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [adminCheck] = await db.query(
      "SELECT is_admin FROM users WHERE email = ?",
      [email]
    );

    if (!adminCheck?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      email: newUserEmail,
      password,
      name,
      is_admin,
    } = await request.json();

    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [newUserEmail]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const ptp = Math.floor(1000 + Math.random() * 9000).toString();

    const result = await db.query(
      "INSERT INTO users (email, password, name, is_admin, ptp) VALUES (?, ?, ?, ?, ?)",
      [newUserEmail, password, name, is_admin, ptp]
    );

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: { email: newUserEmail, name, is_admin },
      ptp,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
