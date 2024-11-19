"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserForm } from "@/components/UserForm";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  name: string | null;
  is_admin: boolean;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push("/");
          return;
        }

        const adminUser = JSON.parse(userData);
        console.log("Attempting to fetch user:", {
          url: `/api/admin/users/${params.id}`,
          headers: {
            "x-user-email": adminUser.email,
            "x-user-ptp": adminUser.ptp || "",
          },
        });

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(
          `${baseUrl}/api/admin/users/${params.id}`,
          {
            headers: {
              "x-user-email": adminUser.email,
              "x-user-ptp": adminUser.ptp || "",
            },
          }
        );

        console.log("API Response Status:", response.status);

        if (!response.ok) {
          if (response.status === 404) {
            console.log("User not found for ID:", params.id);
            toast.error("User not found");
            router.push("/dashboard/users");
            return;
          }
          throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error loading user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <button
          onClick={() => router.push("/dashboard/users")}
          className="text-blue-500 hover:underline"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <UserForm
      mode="edit"
      initialData={{
        id: user.id,
        email: user.email,
        name: user.name || "",
        is_admin: user.is_admin,
      }}
    />
  );
}
