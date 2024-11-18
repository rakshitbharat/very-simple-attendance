import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    const adminUsers = await db.query(
      "SELECT id, is_admin FROM users WHERE email = $1",
      [email]
    );

    const adminUser = adminUsers[0];

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await db.query(
      "SELECT id, email, name, is_admin FROM users WHERE id = $1",
      [params.id]
    );

    if (!userData[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: userData[0] });
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
    const adminUsers = await db.query(
      "SELECT id, is_admin FROM users WHERE email = $1",
      [email]
    );

    const adminUser = adminUsers[0];

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email: userEmail, password, name, is_admin } = await request.json();

    // Build the query dynamically based on whether password is provided
    const updateFields = ["email = $1", "name = $2", "is_admin = $3"];
    const values = [userEmail, name, is_admin];
    let paramCount = 4;

    if (password) {
      updateFields.push(`password = $${paramCount}`);
      values.push(password);
      paramCount++;
    }

    values.push(params.id); // Add id as the last parameter

    const sql = `
      UPDATE users 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramCount - 1}
    `;

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
    const adminUsers = await db.query(
      "SELECT id, is_admin FROM users WHERE email = $1",
      [email]
    );

    const adminUser = adminUsers[0];

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First delete all attendance records for the user
    await db.query("DELETE FROM attendance WHERE user_id = $1", [params.id]);

    // Then delete the user
    await db.query("DELETE FROM users WHERE id = $1", [params.id]);

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
