import { NextResponse } from "next/server";
import { db } from "@/lib/mysql";
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
      const adminResult = (await db.query(
        "SELECT id, ptp FROM users WHERE email = ?",
        [email]
      )) as any[];

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
        ptp: adminUser.ptp, // Include admin's current PTP
      };

      return NextResponse.json({
        success: true,
        deviceToken,
        user: userDataToStore,
      });
    }

    // For non-admin users
    const userResult = (await db.query(
      "SELECT id, ptp, ptp_verified FROM users WHERE email = ?",
      [email]
    )) as any[];

    const user = userResult[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // First time PTP verification
    if (!user.ptp_verified) {
      // Check if PTP matches (4 digits)
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

      // Generate new PTP after successful verification
      const newPtp = Math.floor(1000 + Math.random() * 9000).toString();

      // Update user's PTP and verification status
      await db.query(
        "UPDATE users SET ptp = ?, ptp_verified = TRUE WHERE id = ?",
        [newPtp, user.id]
      );

      // Store the new PTP in the response
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
      // Subsequent verifications - verify against current PTP
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
        ptp: user.ptp, // Keep the same PTP
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
