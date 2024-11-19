import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    const user = await validateAuth(email || "", ptp || "");

    if (!user?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        is_admin: true,
        ptp: true,
        ptp_verified: true,
        created_at: true,
      },
    });

    const transformedUsers = users.map((user) => ({
      id: user.id.toString(),
      email: user.email,
      name: user.name || "",
      is_admin: user.is_admin,
      status: user.ptp_verified ? "active" : "inactive",
      lastLogin: user.created_at,
      ptp: user.ptp,
    }));

    return NextResponse.json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    const user = await validateAuth(email || "", ptp || "");

    if (!user?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, status } = await request.json();

    await prisma.user.update({
      where: { id: userId },
      data: {
        ptp_verified: status === "active",
      },
    });

    return NextResponse.json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
