"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
