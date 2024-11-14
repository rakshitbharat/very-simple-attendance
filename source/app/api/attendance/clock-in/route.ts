import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth";
import { db } from "@/lib/mysql";

export async function POST(request: Request) {
  try {
    // Get email and PTP from headers
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    if (!email || !ptp) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate user with PTP
    const user = await validateAuth(email, ptp);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has an open attendance record
    const [existingRecords] = await db.query(
      "SELECT id FROM attendance WHERE user_id = ? AND clock_out IS NULL",
      [user.id]
    );

    if (existingRecords && existingRecords.length > 0) {
      return NextResponse.json(
        { error: "You already have an active clock-in" },
        { status: 400 }
      );
    }

    // Create new attendance record
    await db.query(
      "INSERT INTO attendance (user_id, clock_in) VALUES (?, CURRENT_TIMESTAMP)",
      [user.id]
    );

    return NextResponse.json({
      success: true,
      message: "Clock in successful",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Clock in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
