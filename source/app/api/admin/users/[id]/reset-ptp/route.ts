import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePTP } from "@/lib/auth";

async function checkAdminStatus(email: string | null) {
  if (!email) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { is_admin: true },
    });
    return user;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.headers.get("x-user-email");
    const adminCheck = await checkAdminStatus(email);

    if (!adminCheck?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert string ID to number
    const userId = parseInt(params.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new PTP
    const newPTP = await generatePTP();

    // Update user with new PTP
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ptp: newPTP,
        ptp_verified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        ptp: true,
      },
    });

    return NextResponse.json({
      message: "PTP reset successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error resetting PTP:", error);
    return NextResponse.json({ error: "Failed to reset PTP" }, { status: 500 });
  }
}
