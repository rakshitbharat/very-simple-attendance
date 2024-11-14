"use client";

import { useEffect, useState } from "react";
import { UserForm } from "@/components/UserForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface Props {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) throw new Error("No user data found");
        const currentUser = JSON.parse(userData);

        const response = await fetch(
          `${window.location.origin}/api/admin/users/${params.id}`,
          {
            headers: {
              "x-user-email": currentUser.email,
              "x-user-ptp": currentUser.ptp || "",
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to fetch user");
        }

        const data = await response.json();
        setUser(data.user); // Note: API returns { user: {...} }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
        router.push("/dashboard/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-medium">User not found</div>
        <Button
          variant="link"
          onClick={() => router.push("/dashboard/users")}
          className="mt-2"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return <UserForm mode="edit" initialData={user} />;
}
