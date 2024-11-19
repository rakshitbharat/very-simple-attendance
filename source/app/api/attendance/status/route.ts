import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await validateAuth(email, ptp || "");
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId: Number(user.id),
        clockIn: {
          gte: today,
        },
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    return NextResponse.json({
      isClockedIn: !!latestRecord && !latestRecord.clockOut,
      lastAction: latestRecord ? latestRecord.clockIn : null,
      record: latestRecord || null,
    });
  } catch (error) {
    console.error("Error checking attendance status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
