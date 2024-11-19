"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Edit2, RefreshCw, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  ptp: string | null;
}

interface UserTableProps {
  users: User[];
  onUserUpdate: () => void;
  currentUserEmail: string;
}

interface ExtendedBadgeProps extends BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function UserTable({
  users,
  onUserUpdate,
  currentUserEmail,
}: UserTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<number | null>(null);

  const handleDelete = async (userId: number) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("No user data found");
      const user = JSON.parse(userData);

      const response = await fetch(
        `${window.location.origin}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": user.email,
            "x-user-ptp": user.ptp || "",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User deleted successfully", {
        description: "The user has been permanently removed from the system",
      });
      onUserUpdate();
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    }
  };

  const handleResetPTP = async (userId: number) => {
    setLoading(userId);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("No user data found");
      const user = JSON.parse(userData);

      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser) throw new Error("User not found");

      const response = await fetch(
        `${window.location.origin}/api/admin/users/${userId}/reset-ptp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": user.email,
            "x-user-ptp": user.ptp || "",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reset PTP");
      }

      const data = await response.json();

      toast.success(
        <div className="space-y-2">
          <div className="font-medium">PTP Reset Successful</div>
          <div className="text-sm">
            New PTP for {targetUser.name || targetUser.email}:
            <span className="font-mono bg-black/10 px-1 rounded mx-1">
              {data.ptp}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            ⚠️ Important Notes:
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>The user will be logged out from all devices</li>
              <li>Share this PTP securely with the user</li>
              <li>The user will need this new PTP to log in again</li>
              <li>This PTP will only be shown once</li>
            </ul>
          </div>
        </div>,
        {
          duration: 15000,
          important: true,
        }
      );

      onUserUpdate();
    } catch (error) {
      console.error("Reset PTP error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reset PTP"
      );
    } finally {
      setLoading(null);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const TableRowAnimated = motion(TableRow);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 transition-all duration-200 border-muted focus-visible:ring-primary/20"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          {filteredUsers.length} users found
        </motion.div>
      </div>

      <div className="border rounded-lg bg-card flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="w-[100px]">Admin</TableHead>
              <TableHead className="min-w-[120px]">PTP</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRowAnimated
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group hover:bg-muted/50"
              >
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.name || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.is_admin ? "default" : "secondary"}
                    className={`${
                      user.is_admin
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {user.is_admin ? "Admin" : "User"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <span className="text-muted-foreground italic text-sm">
                      Not Required
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      {user.ptp ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="hover:opacity-80 transition-opacity">
                              <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded-md font-medium cursor-pointer hover:bg-primary/20">
                                {user.ptp}
                              </span>
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl flex items-center gap-2">
                                <span className="text-primary">🔐</span> PTP
                                Information
                              </AlertDialogTitle>
                              <AlertDialogDescription className="space-y-4">
                                <div className="bg-primary/5 p-4 rounded-lg">
                                  <p className="font-medium text-base mb-2">
                                    Current PTP Code:
                                  </p>
                                  <code className="font-mono text-xl bg-primary/10 text-primary px-3 py-1.5 rounded-md">
                                    {user.ptp}
                                  </code>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium text-base mb-2">
                                      Important Information
                                    </h4>
                                    <ul className="text-sm space-y-2 list-disc pl-4">
                                      <li>
                                        This PTP code is unique to the user and
                                        acts as a security key
                                      </li>
                                      <li>
                                        Share this code securely with{" "}
                                        <span className="font-medium">
                                          {user.name || user.email}
                                        </span>
                                      </li>
                                      <li>
                                        The user will need this code to log in
                                        to their account
                                      </li>
                                    </ul>
                                  </div>

                                  <div>
                                    <h4 className="font-medium text-base mb-2">
                                      Device Registration
                                    </h4>
                                    <ul className="text-sm space-y-2 list-disc pl-4 text-muted-foreground">
                                      <li>
                                        When the user logs in with this PTP,
                                        their current device will be registered
                                      </li>
                                      <li>
                                        Once registered, the user can only
                                        access the system from that device
                                      </li>
                                      <li>
                                        To use a different device, they will
                                        need a new PTP code
                                      </li>
                                      <li>
                                        You can generate a new PTP code using
                                        the reset button if needed
                                      </li>
                                    </ul>
                                  </div>

                                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <h4 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                                      <span>⚠️</span> Security Notice
                                    </h4>
                                    <ul className="text-sm text-amber-700 space-y-1.5 list-disc pl-4">
                                      <li>
                                        Never share this PTP code in public or
                                        unsecured channels
                                      </li>
                                      <li>
                                        The code should be communicated directly
                                        to the user
                                      </li>
                                      <li>
                                        Advise the user to keep their PTP code
                                        confidential
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogAction className="bg-primary">
                                I Understand
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">
                          Not Set
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {user.email === currentUserEmail ? (
                    <span className="text-sm text-muted-foreground italic">
                      Current User
                    </span>
                  ) : (
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/users/edit/${user.id}`)
                        }
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      {!user.is_admin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={loading === user.id}
                              className="hover:bg-amber-500/10 hover:text-amber-500"
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${
                                  loading === user.id ? "animate-spin" : ""
                                }`}
                              />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
                            <AlertDialogHeader className="space-y-4">
                              <AlertDialogTitle className="text-xl">
                                Reset User PTP
                              </AlertDialogTitle>
                              <AlertDialogDescription className="space-y-4">
                                <p className="text-base">
                                  You are about to reset the PTP for user:{" "}
                                  <span className="font-medium text-foreground">
                                    {user.name || user.email}
                                  </span>
                                </p>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                  <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                                    <span className="text-amber-500">⚠️</span>{" "}
                                    Important Warning
                                  </h4>
                                  <ul className="text-sm text-amber-700 list-disc pl-4 space-y-1">
                                    <li>
                                      This action will invalidate the user's
                                      current PTP
                                    </li>
                                    <li>
                                      The user will be immediately logged out
                                      from all devices
                                    </li>
                                    <li>
                                      You will need to securely communicate the
                                      new PTP to the user
                                    </li>
                                    <li>
                                      The new PTP will only be shown once after
                                      reset
                                    </li>
                                  </ul>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                              <AlertDialogCancel className="hover:bg-muted/50">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleResetPTP(user.id)}
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                              >
                                Reset PTP
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                              <p>
                                You are about to permanently delete the user:{" "}
                                <span className="font-medium">
                                  {user.name || user.email}
                                </span>
                              </p>
                              <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                                <h4 className="font-medium text-red-800 mb-2">
                                  ⚠️ Warning
                                </h4>
                                <ul className="text-sm text-red-700 list-disc pl-4 space-y-1">
                                  <li>This action cannot be undone</li>
                                  <li>
                                    The user will be permanently removed from
                                    the system
                                  </li>
                                  <li>All associated data will be deleted</li>
                                  <li>
                                    The user will need to be recreated to regain
                                    access
                                  </li>
                                </ul>
                              </div>
                              <p className="mt-3 text-sm font-medium">
                                Are you absolutely sure you want to proceed?
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRowAnimated>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="text-muted-foreground">No users found</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
