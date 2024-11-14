"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/auth";

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.is_admin) {
      router.push("/dashboard");
      return;
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");

    const sortedUsers = [...users].sort((a, b) => {
      const aValue = a[field] ?? "";
      const bValue = b[field] ?? "";
      const direction = sortDirection === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * direction;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction;
      }

      return String(aValue).localeCompare(String(bValue)) * direction;
    });

    setUsers(sortedUsers);
  };

  const filteredAndSortedUsers = users
    .filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === "asc" ? 1 : -1;
      return aValue < bValue ? -direction : direction;
    });

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button
            onClick={() => router.push("/admin/users/new")}
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add New User
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
          />
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID{" "}
                  {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortField === "email" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-2">Admin</th>
                <th className="px-4 py-2">PTP Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.is_admin ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{user.ptp ? "Set" : "Not Set"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="text-blue-400 hover:text-blue-300 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/admin/users/${user.id}/reset-ptp`)
                      }
                      className="text-yellow-400 hover:text-yellow-300 mr-2"
                    >
                      Reset PTP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
