import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, currentPtp } = await request.json();

    if (!email || !currentPtp) {
      return NextResponse.json(
        { error: "Email and PTP are required" },
        { status: 400 }
      );
    }

    // Get user and verify current PTP
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, ptp: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current PTP
    if (currentPtp !== user.ptp) {
      return NextResponse.json({ error: "Invalid PTP" }, { status: 400 });
    }

    // Generate new PTP
    const newPtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Update user's PTP
    await prisma.user.update({
      where: { id: user.id },
      data: { ptp: newPtp },
    });

    return NextResponse.json({
      success: true,
      newPtp,
    });
  } catch (error) {
    console.error("PTP validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
