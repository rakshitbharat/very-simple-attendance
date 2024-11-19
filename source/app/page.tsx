"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Shield,
  User,
  Key,
  ArrowRight,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ChangeEvent, FormEvent } from "react";
import React, { Fragment } from "react";

interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  browserInfo: string;
  ptpNumber?: string;
  isAdmin?: boolean;
}

interface UserData {
  email: string;
  is_admin: boolean;
}

interface CustomError {
  message: string;
}

interface AdminUserData extends UserData {
  is_admin: boolean;
  [key: string]: any; // for any additional properties
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginStep, setLoginStep] = useState<
    "credentials" | "device-verification"
  >("credentials");
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [ptpNumber, setPtpNumber] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    setMounted(true);
    // Generate device information
    const generateDeviceInfo = (): DeviceInfo => ({
      deviceId: crypto.randomUUID(),
      deviceName: `${navigator.platform} - ${
        navigator.userAgent.split(") ")[0]
      })`,
      browserInfo: navigator.userAgent,
    });
    setDeviceInfo(generateDeviceInfo());

    // Check for existing session
    const checkSession = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const user = JSON.parse(userData);
        const response = await fetch("/api/check-auth", {
          headers: {
            "x-user-email": user.email,
            "x-user-ptp": user.ptp || "",
          },
        });
        const data = await response.json();

        if (response.ok && data.authenticated) {
          router.replace("/dashboard");
        } else {
          // Clear invalid session
          localStorage.removeItem("user");
          localStorage.removeItem("deviceToken");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear any invalid tokens
        localStorage.removeItem("user");
        localStorage.removeItem("deviceToken");
      }
    };

    checkSession();
  }, [router]);

  const handleCredentialsSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/verify-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Credentials verified successfully");
        if (data.user.is_admin) {
          await handleAdminDeviceRegistration(data.user);
        } else {
          setLoginStep("device-verification");
        }
      } else {
        toast.error(data.error || "Invalid credentials");
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification");
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDeviceRegistration = async (userData: AdminUserData) => {
    try {
      const deviceToken = crypto.randomUUID();

      // Create admin user object
      const userObject = {
        ...userData,
        email,
        deviceInfo: {
          ...deviceInfo,
          isAdmin: true,
        },
        deviceToken,
        lastLogin: new Date().toISOString(),
        authenticated: true,
        is_admin: true,
      };

      // Store admin data first
      localStorage.setItem("deviceToken", deviceToken);
      localStorage.setItem("user", JSON.stringify(userObject));

      console.log("Registering admin device...");
      const response = await fetch("/api/register-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-token": deviceToken,
        },
        body: JSON.stringify({
          email,
          deviceInfo: {
            ...deviceInfo,
            isAdmin: true,
          },
          userData: {
            ...userData,
            is_admin: true,
            deviceToken,
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update stored user data with any additional info from response
        const updatedUserObject = {
          ...userObject,
          ...data.user,
        };
        localStorage.setItem("user", JSON.stringify(updatedUserObject));

        console.log("Admin device registration successful");

        // Navigate to dashboard
        await delay(300);
        router.replace("/dashboard");
      } else {
        throw new Error(data.error || "Device registration failed");
      }
    } catch (error) {
      console.error("Device registration error:", error);
      // Clear any partial data
      localStorage.removeItem("user");
      localStorage.removeItem("deviceToken");
      setError("An error occurred during device registration");
    }
  };

  const handleDeviceVerification = async () => {
    if (!ptpNumber || ptpNumber.length < 4) {
      toast.error("Please enter a complete 4-digit PTP number", {
        description: "All digits are required for verification",
      });
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("=== Starting Device Verification Process ===");
      console.log("Initial state:", { email, ptpNumber, deviceInfo });

      // Add initial delay before starting verification
      await delay(200);

      console.log("1. Validating PTP...");
      const verifyResponse = await fetch("/api/validate-ptp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          currentPtp: ptpNumber,
        }),
      });

      const verifyData = await verifyResponse.json();
      console.log("PTP Validation Response:", {
        status: verifyResponse.status,
        ok: verifyResponse.ok,
        data: verifyData,
      });

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "PTP verification failed");
      }

      // Store the verified PTP
      const verifiedPtp = verifyData.newPtp;
      console.log("2. PTP Verified:", { verifiedPtp });

      // First store the auth data to prevent race conditions
      const deviceToken = crypto.randomUUID();
      localStorage.setItem("deviceToken", deviceToken);

      const userObject = {
        email,
        deviceInfo: {
          ...deviceInfo,
          isAdmin: false,
          ptpNumber: verifiedPtp, // Use the verified PTP
        },
        deviceToken,
        lastLogin: new Date().toISOString(),
        ptp: verifiedPtp, // Make sure to use the verified PTP
        authenticated: true,
      };

      // Store user data before device registration
      localStorage.setItem("user", JSON.stringify(userObject));

      console.log("3. Registering device...");
      const devicePayload = {
        email,
        deviceInfo: {
          ...deviceInfo,
          ptpNumber: verifiedPtp,
        },
        userData: {
          email,
          is_admin: false,
          ptp: verifiedPtp,
          deviceToken,
        },
      };

      const response = await fetch("/api/register-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-token": deviceToken,
          "x-user-ptp": verifiedPtp,
        },
        body: JSON.stringify(devicePayload),
      });

      const data = await response.json();
      console.log("Device Registration Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok) {
        // Clear stored data if registration fails
        localStorage.removeItem("user");
        localStorage.removeItem("deviceToken");
        throw new Error(data.error || "Device registration failed");
      }

      // Update the stored user object with any additional data from the response
      const updatedUserObject = {
        ...userObject,
        ...data.user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUserObject));

      console.log("4. Final stored data:", {
        user: updatedUserObject,
        deviceToken,
      });

      // Add a small delay before navigation
      await delay(300);

      // Use replace to prevent back navigation
      router.replace("/dashboard");

      console.log("=== Device Verification Process Completed ===");
    } catch (error) {
      console.error("=== Device Verification Process Failed ===");
      console.error("Error details:", error);
      // Only clear storage if it's an authentication error
      const err = error as CustomError;
      if (
        err.message.includes("unauthorized") ||
        err.message.includes("authentication")
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("deviceToken");
      }
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during device verification"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Card className="w-full max-w-md mx-4">
        {loginStep === "credentials" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="space-y-1">
              <motion.div
                className="flex items-center justify-center mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-10 w-10 text-primary" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to access your attendance dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email to sign in"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                      className="pl-8"
                    />
                    <motion.div
                      className="absolute right-3 top-2.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: email ? 1 : 0 }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password to sign in"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      required
                      className="pl-8"
                    />
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full relative group"
                    disabled={loading}
                  >
                    {loading ? (
                      <Fragment>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </Fragment>
                    ) : (
                      <Fragment>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Fragment>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By signing in, you agree to our terms and conditions
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Secured by PTP verification
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-10 w-10 text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                Device Verification
              </CardTitle>
              <CardDescription className="text-center">
                Secure your device with your Personal Token Pin (PTP)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                className="rounded-lg border p-4 bg-muted/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-medium mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Device Information
                </h3>
                <p className="text-sm text-muted-foreground pl-6">
                  {deviceInfo?.deviceName}
                </p>
              </motion.div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  PTP Number
                  <span className="text-xs text-muted-foreground">
                    (4 digits required)
                  </span>
                </Label>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <InputOTP
                    value={ptpNumber}
                    onChange={setPtpNumber}
                    maxLength={4}
                    className="mt-2"
                    aria-label="PTP number input"
                  />
                </motion.div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleDeviceVerification}
                  disabled={loading || !ptpNumber || ptpNumber.length !== 4}
                  className="w-full relative"
                >
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Device...
                    </motion.div>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify Device
                    </>
                  )}
                </Button>
              </motion.div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Your PTP is a secure token used to verify this device. Please
                keep it safe and don't share it with anyone.
              </p>
            </CardContent>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
