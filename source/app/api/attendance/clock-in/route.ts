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

    // Check if user already has an active clock-in
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

    if (activeRecord) {
      return NextResponse.json(
        {
          error: "Already clocked in",
          record: activeRecord,
        },
        { status: 400 }
      );
    }

    // Create new attendance record
    const record = await prisma.attendanceRecord.create({
      data: {
        userId: Number(user.id),
        clockIn: new Date(),
      },
    });

    return NextResponse.json({
      message: "Successfully clocked in",
      record: record,
    });
  } catch (error) {
    console.error("Clock in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
