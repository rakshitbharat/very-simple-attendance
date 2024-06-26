import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generatePTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default async function handler(req, res) {
  const session = await getSession({ req });

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
      const newPtp = generatePTP();
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
