"use client";

import { useState, useEffect } from "react";
import RecentActivity from "@/app/components/RecentActivity";
import { FiClock, FiCalendar, FiActivity, FiUser } from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const user = JSON.parse(userData);
        const response = await fetch("/api/admin/dashboard-stats", {
          headers: {
            "x-user-email": user.email,
            "x-user-ptp": user.ptp || "",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={<FiUser className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
          title="Total Check-ins"
          value={stats?.totalCheckIns || 0}
          icon={<FiClock className="w-8 h-8 text-green-500" />}
        />
        <StatCard
          title="This Week"
          value={stats?.weeklyCheckIns || 0}
          icon={<FiCalendar className="w-8 h-8 text-purple-500" />}
        />
        <StatCard
          title="Active Sessions"
          value={stats?.activeSessions || 0}
          icon={<FiActivity className="w-8 h-8 text-orange-500" />}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <RecentActivity isAdmin={true} />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="bg-gray-50 p-3 rounded-full">{icon}</div>
    </div>
  </div>
);
