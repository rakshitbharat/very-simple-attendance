import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, deviceInfo } = await request.json();

    if (!email || !deviceInfo) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        ptp: true,
        ptp_verified: true,
        is_admin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // For admin users
    if (user.is_admin) {
      const deviceToken = crypto.randomUUID();
      const userDataToStore = {
        email,
        is_admin: true,
        deviceInfo: {
          ...deviceInfo,
          ptpNumber: undefined,
          isAdmin: true,
        },
        deviceToken,
        lastLogin: new Date().toISOString(),
        ptp: user.ptp,
      };

      return NextResponse.json({
        success: true,
        deviceToken,
        user: userDataToStore,
      });
    }

    // For non-admin users
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

      await prisma.user.update({
        where: { id: user.id },
        data: {
          ptp: newPtp,
          ptp_verified: true,
        },
      });

      const userDataToStore = {
        email,
        is_admin: false,
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
    }

    const userDataToStore = {
      email,
      is_admin: false,
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
