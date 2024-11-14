import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth";
import { db } from "@/lib/mysql";

export async function GET(request: Request) {
  try {
    // Get email from headers
    const email = request.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if user is admin and get user id
    const [userRows] = await db.query(
      `SELECT id, is_admin FROM users WHERE email = ?`,
      [email]
    );
    const user = Array.isArray(userRows) ? userRows[0] : userRows;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // For non-admin users, validate PTP
    if (!user.is_admin) {
      const ptp = request.headers.get("x-user-ptp");
      if (!ptp) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const validatedUser = await validateAuth(email, ptp);
      if (!validatedUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Get the user's latest attendance record using user_id
    const [record] = await db.query(
      `SELECT clock_in, clock_out 
       FROM attendance 
       WHERE user_id = ? 
       AND DATE(created_at) = CURRENT_DATE()
       ORDER BY id DESC 
       LIMIT 1`,
      [user.id]
    );

    const isClockedIn = record && !record.clock_out;
    const lastAction = record ? record.clock_out || record.clock_in : null;

    return NextResponse.json({
      isClockedIn,
      lastAction,
    });
  } catch (error) {
    console.error("Error checking attendance status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
