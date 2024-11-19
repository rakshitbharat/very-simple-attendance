"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, ShieldAlert, UserPlus, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["user", "admin"]).default("user"),
  password: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  };
  mode: "add" | "edit";
}

export function UserForm({ initialData, mode }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.is_admin ? "admin" : "user",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("No user data found");
      const user = JSON.parse(userData);

      const endpoint =
        mode === "add"
          ? `${window.location.origin}/api/admin/users`
          : `${window.location.origin}/api/admin/users/${initialData?.id}`;

      // Prepare the request body
      const requestBody = {
        name: data.name,
        email: data.email,
        is_admin: data.role === "admin",
        ...(data.password ? { password: data.password } : {}),
      };

      const response = await fetch(endpoint, {
        method: mode === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.email,
          "x-user-ptp": user.ptp || "",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save user");
      }

      toast.success(
        mode === "add"
          ? "User created successfully"
          : "User updated successfully",
        {
          description:
            mode === "add"
              ? "The new user has been added to the system"
              : "The user details have been updated",
        }
      );

      // Use replace instead of push to prevent back navigation
      router.replace("/dashboard/users");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              {mode === "add" ? (
                <UserPlus className="h-6 w-6 text-primary" />
              ) : (
                <UserCog className="h-6 w-6 text-primary" />
              )}
              <CardTitle>
                {mode === "add" ? "Add New User" : "Edit User"}
              </CardTitle>
            </div>
            <CardDescription>
              {mode === "add"
                ? "Create a new user account in the system"
                : "Modify existing user account details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter user's full name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        The user's display name in the system
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter user's email address"
                          {...field}
                          disabled={isLoading || mode === "edit"}
                        />
                      </FormControl>
                      <FormDescription>
                        {mode === "edit"
                          ? "Email address cannot be changed after creation"
                          : "The email address will be used for login"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">Regular User</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the role and access level for this user
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("role") === "admin" && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 font-medium">
                      Important Security Notice
                    </AlertTitle>
                    <AlertDescription className="mt-2 text-sm text-amber-700">
                      Administrator users have full access to:
                      <ul className="list-disc pl-4 mt-2 space-y-1">
                        <li>Manage all user accounts</li>
                        <li>Access system settings</li>
                        <li>View all attendance records</li>
                        <li>Generate reports</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={
                            mode === "add"
                              ? "Enter password"
                              : "Enter new password"
                          }
                          {...field}
                          disabled={isLoading}
                          className="font-mono"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        {mode === "add"
                          ? "Set a password for this user"
                          : "Current password will be kept if left empty"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-4 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {mode === "add" ? "Create User" : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
