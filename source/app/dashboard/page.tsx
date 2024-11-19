"use client";

import { useState, useEffect } from "react";
import {
  FiClock,
  FiCalendar,
  FiActivity,
  FiUser,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/navigation";
import RecentActivity from "@/app/components/RecentActivity";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-hot-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  deviceInfo?: {
    deviceId: string;
    deviceName: string;
    browserInfo: string;
    isAdmin?: boolean;
  };
}

interface AttendanceRecord {
  type: "in" | "out";
  timestamp: string;
}

interface Activity {
  id: number;
  userName: string;
  userEmail: string;
  clockIn: string;
  clockOut: string | null;
  status: "Active" | "Completed";
  duration: string | null;
}

interface DashboardStats {
  activeUsers: number;
  totalCheckIns: number;
  weeklyCheckIns: number;
  activeSessions: number;
  attendanceTrends: {
    date: string;
    count: number;
  }[];
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [lastAction, setLastAction] = useState<Date | null>(null);
  const [recentActivities, setRecentActivities] = useState<AttendanceRecord[]>(
    []
  );
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const userData = localStorage.getItem("user");
        const deviceToken = localStorage.getItem("deviceToken");

        if (!userData || !deviceToken) {
          throw new Error("No auth data");
        }

        const user = JSON.parse(userData);

        if (user.is_admin) {
          if (!user.deviceToken) {
            throw new Error("Invalid admin data");
          }
        } else {
          if (!user.ptp || !user.deviceToken) {
            throw new Error("Invalid user data");
          }
        }

        setCurrentUser({
          id: user.id || 0,
          name: user.name || "",
          email: user.email,
          is_admin: user.is_admin || false,
          deviceInfo: user.deviceInfo,
        });

        setIsAuthenticated(true);
        await checkAttendanceStatus();
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("deviceToken");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  const handleForceLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("deviceToken");
    router.replace("/");
  };

  const checkAttendanceStatus = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        handleForceLogout();
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch("/api/attendance/status", {
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.email,
          "x-user-ptp": user.ptp || "",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === "Unauthorized") {
          handleForceLogout();
          return;
        }
      }

      const data = await response.json();
      setClockedIn(data.isClockedIn);
      setLastAction(data.lastAction ? new Date(data.lastAction) : null);
    } catch (error) {
      console.error("Error checking attendance status:", error);
    }
  };

  const handleClockAction = async (action: "in" | "out") => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        handleForceLogout();
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch(`/api/attendance/clock-${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.email,
          "x-user-ptp": user.ptp || "",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === "Unauthorized") {
          handleForceLogout();
          return;
        }
        throw new Error(data.error || `Failed to clock ${action}`);
      }

      const data = await response.json();
      setClockedIn(action === "in");
      setLastAction(new Date(data.record.clockIn));

      // Refresh attendance status
      await checkAttendanceStatus();

      // Show success message
      toast.success(`Successfully clocked ${action}`);
    } catch (error) {
      console.error(`Clock ${action} error:`, error);
      toast.error(
        error instanceof Error ? error.message : `Failed to clock ${action}`
      );
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch("/api/attendance/recent");
      const data = await response.json();
      setRecentActivities(data.activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  // Admin Dashboard Component
  const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [adminActivities, setAdminActivities] = useState<Activity[]>([]);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          // Get user data from localStorage
          const userData = localStorage.getItem("user");
          if (!userData) {
            handleForceLogout();
            return;
          }

          const user = JSON.parse(userData);

          const response = await fetch("/api/admin/dashboard-stats", {
            headers: {
              "Content-Type": "application/json",
              "x-user-email": user.email,
              "x-user-ptp": user.ptp || "", // PTP is optional for admin users
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              handleForceLogout();
              return;
            }
            throw new Error("Failed to fetch stats");
          }

          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }
      };

      const fetchAdminActivities = async () => {
        try {
          const userData = localStorage.getItem("user");
          if (!userData) {
            handleForceLogout();
            return;
          }

          const user = JSON.parse(userData);
          const response = await fetch("/api/admin/recent-activity", {
            headers: {
              "Content-Type": "application/json",
              "x-user-email": user.email,
              "x-user-ptp": user.ptp || "",
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              handleForceLogout();
              return;
            }
            throw new Error("Failed to fetch activities");
          }

          const data = await response.json();
          setAdminActivities(data);
        } catch (error) {
          console.error("Error fetching admin activities:", error);
        }
      };

      const fetchData = async () => {
        await Promise.all([fetchStats(), fetchAdminActivities()]);
      };

      fetchData();
    }, []);

    const chartData = {
      labels:
        stats?.attendanceTrends.map((trend) =>
          new Date(trend.date).toLocaleDateString("en-US", { weekday: "short" })
        ) || [],
      datasets: [
        {
          label: "Daily Check-ins",
          data: stats?.attendanceTrends.map((trend) => trend.count) || [],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    return (
      <div className="space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Attendance Trends</h2>
            <Line data={chartData} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {adminActivities && adminActivities.length > 0 ? (
                adminActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <p className="text-gray-500">No recent activities</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // User Dashboard Component
  const UserDashboard = () => {
    const [userStats, setUserStats] = useState({
      totalHours: 0,
      weeklyHours: 0,
      monthlyAttendance: 0,
      streakDays: 0,
    });
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [attendanceDates, setAttendanceDates] = useState<Date[]>([]);

    useEffect(() => {
      // Fetch attendance dates for the calendar
      const fetchAttendanceDates = async () => {
        try {
          const userData = localStorage.getItem("user");
          if (!userData) return;

          const user = JSON.parse(userData);
          const response = await fetch("/api/attendance/calendar", {
            headers: {
              "Content-Type": "application/json",
              "x-user-email": user.email,
              "x-user-ptp": user.ptp || "",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAttendanceDates(
              data.map((record: any) => new Date(record.clockIn))
            );
          }
        } catch (error) {
          console.error("Error fetching attendance dates:", error);
        }
      };

      fetchAttendanceDates();
    }, [clockedIn]); // Add clockedIn as dependency to refresh calendar

    const tileClassName = ({ date }: { date: Date }) => {
      if (
        attendanceDates.some(
          (attendanceDate) =>
            attendanceDate.toDateString() === date.toDateString()
        )
      ) {
        return "bg-green-100 text-green-800 rounded-full";
      }
      return "";
    };

    return (
      <div className="space-y-6">
        {/* Clock In/Out Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  clockedIn ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <FiClock
                  className={`w-8 h-8 ${
                    clockedIn ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {clockedIn ? "Currently Working" : "Not Checked In"}
                </h2>
                {lastAction && (
                  <p className="text-sm text-gray-500">
                    Last action: {lastAction.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleClockAction(clockedIn ? "out" : "in")}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                clockedIn
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Clock {clockedIn ? "Out" : "In"}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Hours</p>
                <p className="text-2xl font-semibold mt-1">
                  {clockedIn ? "Active" : "0h 0m"}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <FiClock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Weekly Hours</p>
                <p className="text-2xl font-semibold mt-1">
                  {userStats.weeklyHours}h
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <FiTrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Attendance</p>
                <p className="text-2xl font-semibold mt-1">
                  {userStats.monthlyAttendance}%
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <FiCheckCircle className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Attendance Streak</p>
                <p className="text-2xl font-semibold mt-1">
                  {userStats.streakDays} days
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-full">
                <FiActivity className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Activity and Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[600px]">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <RecentActivity compact={true} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiCalendar className="text-blue-500" />
              Monthly Overview
            </h2>
            <div className="calendar-container h-full">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                className="w-full border-none"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>
                {attendanceDates.some(
                  (date) => date.toDateString() === selectedDate.toDateString()
                ) ? (
                  <div className="text-green-600 flex items-center gap-2">
                    <FiCheckCircle />
                    <span>Present</span>
                  </div>
                ) : (
                  <div className="text-gray-500">No attendance record</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading || !isAuthenticated || !currentUser) {
    return null; // or a loading spinner
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {currentUser.name || currentUser.email}
      </h1>
      {currentUser.is_admin ? <AdminDashboard /> : <UserDashboard />}
    </main>
  );
}

// Utility Components
const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <div className="flex items-center space-x-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activity.status === "Active" ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        <FiClock
          className={`w-5 h-5 ${
            activity.status === "Active" ? "text-green-500" : "text-gray-500"
          }`}
        />
      </div>
      <div>
        <p className="font-medium">
          <span className="text-gray-700">{activity.userName}</span>
          {" - "}
          <span
            className={
              activity.status === "Active" ? "text-green-500" : "text-gray-500"
            }
          >
            {activity.status}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          Clocked in: {new Date(activity.clockIn).toLocaleString()}
          {activity.clockOut && (
            <>
              <br />
              Clocked out: {new Date(activity.clockOut).toLocaleString()}
            </>
          )}
        </p>
        {activity.duration && (
          <p className="text-xs text-gray-400">Duration: {activity.duration}</p>
        )}
      </div>
    </div>
  );
};
