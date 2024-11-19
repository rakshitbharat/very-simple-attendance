"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Users2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserTable } from "@/components/UserTable";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (!user.is_admin) {
        router.push("/dashboard");
        return;
      }
      setCurrentUser({
        id: user.id || 0,
        name: user.name || "",
        email: user.email,
        is_admin: true,
      });
      fetchUsers();
    } else {
      router.push("/");
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("No user data found");

      const user = JSON.parse(userData);
      const response = await fetch("/api/admin/users", {
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.email,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserEmail = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return "";
    return JSON.parse(userData).email;
  };

  if (!currentUser?.is_admin) return null;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users2 className="h-6 w-6" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage your organization's user accounts
                  </CardDescription>
                </div>
                <Button onClick={() => router.push("/dashboard/new-user")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4"
                >
                  {error}
                </motion.div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <UserTable
                  users={users}
                  onUserUpdate={fetchUsers}
                  currentUserEmail={getCurrentUserEmail()}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
