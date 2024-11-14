import { NextResponse } from "next/server";
import { validateCredentials } from "@/lib/auth";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Login attempt received for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await validateCredentials(email, password);

    if (!user) {
      console.log("Login failed - invalid credentials");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("Login successful for user:", {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    });

    const requiresPtp = !user.ptp_verified;

    // Generate JWT token
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
      ptp_verified: !requiresPtp,
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
      },
      requiresPtp,
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
