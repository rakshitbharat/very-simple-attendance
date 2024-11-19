import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkAdminStatus(
  email: string | null
): Promise<{ is_admin: boolean } | false> {
  if (!email) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { is_admin: true },
    });
    return user || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("API Route - Starting GET request", {
    url: request.url,
    params,
    headers: Object.fromEntries(request.headers.entries()),
  });

  try {
    const email = request.headers.get("x-user-email");
    console.log("Received request for user:", params.id, "from:", email);

    const adminCheck = await checkAdminStatus(email);
    console.log("Admin check result:", adminCheck);

    if (adminCheck === false || !adminCheck.is_admin) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id, 10);
    console.log("Attempting to find user with ID:", userId);

    if (isNaN(userId)) {
      console.log("Invalid user ID format:", params.id);
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Log prisma connection status
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        is_admin: true,
        password: true,
      },
    });

    console.log(
      "Database query result:",
      user ? "User found" : "User not found"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      password: user.password || "",
    });
  } catch (error) {
    console.error("Detailed error in GET route:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      params: params,
    });
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.headers.get("x-user-email");
    const adminCheck = await checkAdminStatus(email);

    if (adminCheck === false || !adminCheck.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const data = await request.json();

    const updateData = {
      name: data.name,
      is_admin: data.is_admin,
      ...(data.password ? { password: data.password } : {}),
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        is_admin: true,
        password: true,
      },
    });

    return NextResponse.json({
      ...updatedUser,
      password: updatedUser.password || "",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const email = request.headers.get("x-user-email");
    const adminCheck = await checkAdminStatus(email);

    if (adminCheck === false || !adminCheck.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // First, check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        records: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has attendance records
    if (user.records.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete user with attendance records. Please archive the user instead.",
        },
        { status: 400 }
      );
    }

    // If no attendance records, proceed with deletion
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
