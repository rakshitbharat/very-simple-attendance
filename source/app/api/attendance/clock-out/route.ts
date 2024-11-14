import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth";
import { db } from "@/lib/mysql";

export async function POST(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    if (!email || !ptp) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await validateAuth(email, ptp);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user's active attendance record
    const [activeRecords] = await db.query(
      "SELECT id FROM attendance WHERE user_id = ? AND clock_out IS NULL LIMIT 1",
      [user.id]
    );

    const activeRecord = Array.isArray(activeRecords)
      ? activeRecords[0]
      : activeRecords;

    if (!activeRecord) {
      return NextResponse.json(
        { error: "No active clock-in found" },
        { status: 400 }
      );
    }

    // Update the record with clock out time
    await db.query(
      "UPDATE attendance SET clock_out = CURRENT_TIMESTAMP WHERE id = ?",
      [activeRecord.id]
    );

    return NextResponse.json({
      success: true,
      message: "Clock out successful",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Clock out error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
