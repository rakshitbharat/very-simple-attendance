"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  is_admin: boolean;
  email?: string;
  name?: string;
  deviceInfo?: {
    isAdmin?: boolean;
  };
}

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("user");
      localStorage.removeItem("deviceToken");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  // Simplify admin check to just use is_admin
  const isAdmin = user.is_admin || user.deviceInfo?.isAdmin;

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-white text-lg font-semibold"
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/users"
                className="ml-4 text-gray-300 hover:text-white"
              >
                User Management
              </Link>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4">
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
