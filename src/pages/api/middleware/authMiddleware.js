import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const [email, password, ptp] = authHeader.split("|||");

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user && user.password === password && (!ptp || user.ptp === ptp)) {
      req.user = { id: user.id, email: user.email, isAdmin: user.is_admin };
      next();
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
