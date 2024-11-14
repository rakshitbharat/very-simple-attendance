import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";
import { generatePTP } from "@/lib/auth";

export async function POST(
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

    // Generate new PTP
    const newPtp = await generatePTP();

    // Get user data
    const [user] = await db.query(
      "SELECT email, name FROM users WHERE id = ?",
      [params.id]
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user's PTP
    await db.query(
      "UPDATE users SET ptp = ?, ptp_verified = FALSE WHERE id = ?",
      [newPtp, params.id]
    );

    return NextResponse.json({
      success: true,
      message: "PTP reset successfully",
      user: {
        email: user.email,
        name: user.name,
      },
      ptp: newPtp,
    });
  } catch (error) {
    console.error("Error resetting PTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
