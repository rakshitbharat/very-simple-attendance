import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, deviceInfo, userData } = await request.json();

    if (!email || !deviceInfo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For admin users
    if (userData?.role === "admin") {
      const adminResult = await db.query(
        "SELECT id, ptp FROM users WHERE email = $1",
        [email]
      );

      const adminUser = adminResult[0];

      if (!adminUser) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      const deviceToken = crypto.randomUUID();
      const userDataToStore = {
        email,
        role: userData?.role || "user",
        deviceInfo: {
          ...deviceInfo,
          ptpNumber: undefined,
          isAdmin: true,
        },
        deviceToken,
        lastLogin: new Date().toISOString(),
        ptp: adminUser.ptp,
      };

      return NextResponse.json({
        success: true,
        deviceToken,
        user: userDataToStore,
      });
    }

    // For non-admin users
    const userResult = await db.query(
      "SELECT id, ptp, ptp_verified FROM users WHERE email = $1",
      [email]
    );

    const user = userResult[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // First time PTP verification
    if (!user.ptp_verified) {
      if (
        !deviceInfo.ptpNumber ||
        deviceInfo.ptpNumber.length !== 4 ||
        deviceInfo.ptpNumber !== user.ptp
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid PTP number" },
          { status: 400 }
        );
      }

      const newPtp = Math.floor(1000 + Math.random() * 9000).toString();

      await db.query(
        "UPDATE users SET ptp = $1, ptp_verified = TRUE WHERE id = $2",
        [newPtp, user.id]
      );

      const userDataToStore = {
        email,
        role: userData?.role || "user",
        deviceInfo: {
          ...deviceInfo,
          ptpNumber: undefined,
        },
        deviceToken: crypto.randomUUID(),
        lastLogin: new Date().toISOString(),
        ptp: newPtp,
      };

      return NextResponse.json({
        success: true,
        deviceToken: userDataToStore.deviceToken,
        user: userDataToStore,
      });
    } else {
      if (deviceInfo.ptpNumber !== user.ptp) {
        return NextResponse.json(
          { success: false, error: "Invalid PTP number" },
          { status: 400 }
        );
      }

      const userDataToStore = {
        email,
        role: userData?.role || "user",
        deviceInfo: {
          ...deviceInfo,
          ptpNumber: undefined,
        },
        deviceToken: crypto.randomUUID(),
        lastLogin: new Date().toISOString(),
        ptp: user.ptp,
      };

      return NextResponse.json({
        success: true,
        deviceToken: userDataToStore.deviceToken,
        user: userDataToStore,
      });
    }
  } catch (error) {
    console.error("Device registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Device registration failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
