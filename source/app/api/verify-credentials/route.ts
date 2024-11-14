import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with PTP
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
      ptp: user.ptp, // Include PTP in token
      ptp_verified: user.ptp_verified,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(
        new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")
      );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
        deviceInfo: {
          isAdmin: user.is_admin,
        },
      },
    });

    // Set the session cookie
    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }
}
