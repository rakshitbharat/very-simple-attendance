import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const headers = req.headers;
    const userEmail = headers.get("x-user-email");
    const userPTP = headers.get("x-user-ptp");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await validateAuth(userEmail, userPTP || undefined);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all attendance dates for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const attendance = await db.query(
      `SELECT clock_in 
       FROM attendance 
       WHERE user_id = $1 
       AND clock_in >= $2 
       AND clock_in <= $3
       ORDER BY clock_in ASC`,
      [user.id, startOfMonth, endOfMonth]
    );

    const dates = attendance.map((record: any) => record.clock_in);

    return NextResponse.json({ dates });
  } catch (error) {
    console.error("Error fetching calendar dates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
