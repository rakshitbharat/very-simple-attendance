import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    console.log("Received email header:", email);

    if (!email) {
      console.log("No email found in header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email },
      select: { is_admin: true },
    });

    console.log("Admin check result:", adminUser);

    if (!adminUser?.is_admin) {
      console.log("User is not admin:", email);
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
      },
    });

    console.log("Fetched users count:", users.length);

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
        ptp: user.ptp,
        ptp_verified: user.ptp_verified,
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const email = request.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email },
      select: { is_admin: true },
    });

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      email: newUserEmail,
      password,
      name,
      is_admin,
    } = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newUserEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const ptp = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = await prisma.user.create({
      data: {
        email: newUserEmail,
        password,
        name,
        is_admin,
        ptp,
      },
      select: {
        email: true,
        name: true,
        is_admin: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: newUser,
      ptp,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "P2002") {
      // Prisma unique constraint violation code
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
