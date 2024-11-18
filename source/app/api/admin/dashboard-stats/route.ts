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

    const user = await validateAuth(userEmail, userPTP);

    if (!user?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get all stats in parallel
    const [totalUsers, totalCheckIns, weeklyCheckIns, activeSessions] =
      await Promise.all([
        db.users.count(),
        db.attendance.count(),
        db.attendance.count({
          clock_in: {
            gte: weekAgo,
          },
        }),
        db.attendance.count({
          clock_out: null,
        }),
      ]);

    // Get attendance trends
    const attendanceTrends = await db.query(
      `SELECT 
        DATE(clock_in) as date,
        COUNT(*) as count
      FROM attendance
      WHERE clock_in >= $1
      GROUP BY DATE(clock_in)
      ORDER BY date DESC
      LIMIT 7`,
      [weekAgo]
    );

    return NextResponse.json({
      activeUsers: Number(totalUsers),
      totalCheckIns: Number(totalCheckIns),
      weeklyCheckIns: Number(weeklyCheckIns),
      activeSessions: Number(activeSessions),
      attendanceTrends,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
