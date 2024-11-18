import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const user = await validateAuth();

    if (!user?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.query(
      "SELECT id, email, name, is_admin, ptp, ptp_verified, created_at as lastLogin FROM users"
    );

    // Transform the data to match the expected format
    const transformedUsers = users.map((user: any) => ({
      id: user.id.toString(),
      email: user.email,
      name: user.name || "",
      role: user.is_admin ? "admin" : "user",
      status: user.ptp_verified ? "active" : "inactive",
      lastLogin: user.lastLogin,
      ptp: user.ptp,
      is_admin: user.is_admin,
    }));

    return NextResponse.json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await validateAuth();

    if (!user?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, status } = await request.json();

    await db.query("UPDATE users SET ptp_verified = $1 WHERE id = $2", [
      status === "active",
      userId,
    ]);

    return NextResponse.json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
