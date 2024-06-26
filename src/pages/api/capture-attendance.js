import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const userId = session.user.id;

    const latestAttendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        OR: [
          { clockIn: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
          { clockOut: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        ],
      },
      orderBy: { id: "desc" },
    });

    if (!latestAttendance || latestAttendance.clockOut) {
      // Clock In
      const newAttendance = await prisma.attendance.create({
        data: {
          userId: userId,
          clockIn: new Date(),
        },
      });
      res
        .status(200)
        .json({ action: "clock_in", timestamp: newAttendance.clockIn });
    } else {
      // Clock Out
      const updatedAttendance = await prisma.attendance.update({
        where: { id: latestAttendance.id },
        data: { clockOut: new Date() },
      });
      res
        .status(200)
        .json({ action: "clock_out", timestamp: updatedAttendance.clockOut });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
