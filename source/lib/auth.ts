import { prisma } from "./prisma";
import type { User as PrismaUser } from ".prisma/client";

export interface User {
  id: string | number;
  email: string;
  name: string | null;
  is_admin: boolean;
  ptp: string | null;
  ptp_verified?: boolean;
}

export async function validateAuth(
  email: string,
  ptp?: string
): Promise<User | null> {
  try {
    if (!email) {
      console.log("No email provided");
      return null;
    }

    console.log("Validating auth for:", email, "PTP:", ptp);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        is_admin: true,
        ptp: true,
        ptp_verified: true,
      },
    });

    if (!user) {
      console.log("No user found in database for email:", email);
      return null;
    }

    if (user.is_admin) {
      console.log("Admin user - skipping PTP check");
      return user;
    }

    if (!ptp || ptp !== user.ptp) {
      console.log("PTP mismatch or missing - authentication failed");
      return null;
    }

    console.log("Auth successful for:", email);
    return user;
  } catch (error) {
    console.error("Auth validation error:", error);
    return null;
  }
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<User | null> {
  try {
    console.log("Validating credentials for:", email);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        is_admin: true,
        ptp: true,
        ptp_verified: true,
        password: true,
      },
    });

    if (!user) {
      console.log("User not found");
      return null;
    }

    if (user.password !== password) {
      console.log("Password mismatch");
      return null;
    }

    console.log("Credentials validated successfully");

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      ptp: user.ptp,
      ptp_verified: user.ptp_verified,
    };
  } catch (error) {
    console.error("Error validating credentials:", error);
    return null;
  }
}

export async function generatePTP(): Promise<string> {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
