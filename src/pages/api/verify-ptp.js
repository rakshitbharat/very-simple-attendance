import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { ptp } = req.body;
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.ptp === ptp) {
      const newPtp = Math.floor(1000 + Math.random() * 9000).toString();
      await prisma.user.update({
        where: { id: userId },
        data: { ptp: newPtp },
      });
      res.status(200).json({ valid: true, newPtp });
    } else {
      res.status(400).json({ valid: false, message: "Invalid PTP" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
