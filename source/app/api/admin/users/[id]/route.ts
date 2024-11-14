import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [adminUser] = await db.query(
      "SELECT id, is_admin FROM users WHERE email = ?",
      [email]
    );

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userData] = await db.query(
      "SELECT id, email, name, is_admin FROM users WHERE id = ?",
      [params.id]
    );

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [adminUser] = await db.query(
      "SELECT id, is_admin FROM users WHERE email = ?",
      [email]
    );

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email: userEmail, password, name, is_admin } = await request.json();

    // Start building the SQL query and values array
    let sql = "UPDATE users SET email = ?, name = ?, is_admin = ?";
    let values: any[] = [userEmail, name, is_admin];

    // If password is provided, update it
    if (password) {
      sql += ", password = ?";
      values.push(password);
    }

    // Add WHERE clause
    sql += " WHERE id = ?";
    values.push(params.id);

    await db.query(sql, values);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [adminUser] = await db.query(
      "SELECT id, is_admin FROM users WHERE email = ?",
      [email]
    );

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First delete all attendance records for the user
    await db.query("DELETE FROM attendance WHERE user_id = ?", [params.id]);

    // Then delete the user
    await db.query("DELETE FROM users WHERE id = ?", [params.id]);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
