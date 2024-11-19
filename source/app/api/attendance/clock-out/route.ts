import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAuth } from "@/lib/auth";

export async function POST(request: Request) {
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

    // Find active attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeRecord = await prisma.attendanceRecord.findFirst({
      where: {
        userId: Number(user.id),
        clockIn: {
          gte: today,
        },
        clockOut: null,
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    if (!activeRecord) {
      return NextResponse.json(
        { error: "No active clock-in found" },
        { status: 400 }
      );
    }

    // Update record with clock out time
    const record = await prisma.attendanceRecord.update({
      where: {
        id: activeRecord.id,
      },
      data: {
        clockOut: new Date(),
      },
    });

    return NextResponse.json({
      message: "Successfully clocked out",
      record: record,
    });
  } catch (error) {
    console.error("Clock out error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
