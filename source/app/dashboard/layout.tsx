"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface User {
  email: string;
  is_admin: boolean;
  name?: string;
  ptp?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser: User = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link
                    href="/dashboard"
                    className="text-xl font-bold text-gray-800"
                  >
                    Attendance System
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  {user?.is_admin && (
                    <Link
                      href="/dashboard/users"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Attendance System. All rights reserved.
        </div>
      </footer>
    </>
  );
}
