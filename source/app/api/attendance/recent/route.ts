import { NextRequest } from "next/server";
import { json } from "@/lib/json-response";
import { validateAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AttendanceRecord } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const headers = req.headers;
    const userEmail = headers.get("x-user-email");
    const userPTP = headers.get("x-user-ptp");

    if (!userEmail || !userPTP) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await validateAuth(userEmail, userPTP);
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentActivity = await prisma.attendanceRecord.findMany({
      where: {
        userId: Number(user.id),
      },
      take: 5,
      orderBy: {
        clockIn: "desc",
      },
    });

    return json(recentActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}

function calculateDuration(clockIn: Date, clockOut: Date): string {
  const diff = clockOut.getTime() - clockIn.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
