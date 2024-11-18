import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAuth } from "@/lib/auth";

interface ActivityRecord {
  id: number;
  clock_in: Date;
  clock_out: Date | null;
  user_name: string;
  user_email: string;
}

export async function GET(req: Request) {
  try {
    const headers = req.headers;
    const userEmail = headers.get("x-user-email");
    const userPTP = headers.get("x-user-ptp");

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await validateAuth(userEmail, userPTP || "");

    if (!user?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recent activity with user details
    const recentActivity = await db.query(`
      SELECT 
        a.id,
        a.clock_in,
        a.clock_out,
        u.name as user_name,
        u.email as user_email
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.clock_in DESC
      LIMIT 10
    `);

    // Format the data
    const formattedActivity = recentActivity.map(
      (activity: ActivityRecord) => ({
        id: activity.id,
        userName: activity.user_name || "Unknown User",
        userEmail: activity.user_email,
        clockIn: activity.clock_in,
        clockOut: activity.clock_out,
        status: activity.clock_out ? "Completed" : "Active",
        duration: activity.clock_out
          ? calculateDuration(activity.clock_in, activity.clock_out)
          : null,
      })
    );

    return NextResponse.json(formattedActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateDuration(clockIn: Date, clockOut: Date): string {
  const diff = clockOut.getTime() - clockIn.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
