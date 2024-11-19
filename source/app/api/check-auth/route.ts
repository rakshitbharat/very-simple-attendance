import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Get email and PTP from headers
    const email = request.headers.get("x-user-email");
    const ptp = request.headers.get("x-user-ptp");

    if (!email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await validateAuth(email, ptp);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
        name: user.name,
        ptp_verified: user.ptp_verified,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
