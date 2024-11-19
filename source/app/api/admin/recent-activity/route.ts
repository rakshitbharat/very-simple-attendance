import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAuth } from "@/lib/auth";
import type { AttendanceRecord } from "@prisma/client";

interface RecordWithUser extends AttendanceRecord {
  user: {
    id: number;
    name: string | null;
    email: string;
  };
}

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    console.log("Recent activity request for:", { email, ptp });

    const user = await validateAuth(email || "", ptp || "");
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentActivity = await prisma.attendanceRecord.findMany({
      take: 5,
      orderBy: {
        clockIn: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      recentActivity.map((record: RecordWithUser) => ({
        id: record.id,
        userId: record.userId,
        clockIn: record.clockIn,
        clockOut: record.clockOut,
        user: {
          name: record.user.name,
          email: record.user.email,
        },
      }))
    );
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
