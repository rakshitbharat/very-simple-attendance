import { NextRequest } from "next/server";
import { json } from "@/lib/json-response";
import { validateAuth } from "@/lib/auth";
import { db } from "@/lib/mysql";

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

    const recentActivity = await db.query(
      `SELECT * FROM attendance 
       WHERE user_id = ? 
       ORDER BY clock_in DESC 
       LIMIT 5`,
      [user.id]
    );

    const activityArray = Array.isArray(recentActivity)
      ? recentActivity
      : [recentActivity];

    const formattedActivity = activityArray.map((activity: any) => ({
      id: activity.id,
      clockIn: activity.clock_in,
      clockOut: activity.clock_out,
      status: activity.clock_out ? "Completed" : "Active",
      duration: activity.clock_out
        ? calculateDuration(
            new Date(activity.clock_in),
            new Date(activity.clock_out)
          )
        : null,
    }));

    return json(formattedActivity);
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
