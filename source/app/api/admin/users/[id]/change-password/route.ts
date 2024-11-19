import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.headers.get("x-user-email");

    // Check admin status
    const admin = await prisma.user.findUnique({
      where: { email: email || "" },
      select: { is_admin: true },
    });

    if (!admin?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Update user's password directly (no hashing)
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        password: newPassword, // Store password as plain text
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log("Password updated successfully for user:", updatedUser.email);

    return NextResponse.json({
      message: "Password updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
