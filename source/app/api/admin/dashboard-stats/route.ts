import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAuth } from "@/lib/auth";

interface AttendanceTrend {
  date: string;
  count: number;
}

interface TrendResult {
  clockIn: Date;
  _count: {
    id: number;
  };
}

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    console.log("Dashboard stats request for:", { email, ptp });

    const user = await validateAuth(email || "", ptp || "");
    if (!user || !user.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get active users (clocked in today)
    const activeUsers = await prisma.attendanceRecord.count({
      where: {
        clockIn: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        clockOut: null,
      },
    });

    // Get attendance trends for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const attendanceTrends = await prisma.attendanceRecord.groupBy({
      by: ["clockIn"],
      where: {
        clockIn: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        clockIn: "asc",
      },
    });

    // Format trends data
    const trends: AttendanceTrend[] = (attendanceTrends as TrendResult[]).map(
      (trend) => ({
        date: trend.clockIn.toISOString(),
        count: trend._count.id,
      })
    );

    return NextResponse.json({
      totalUsers,
      activeUsers,
      attendanceTrends: trends,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
