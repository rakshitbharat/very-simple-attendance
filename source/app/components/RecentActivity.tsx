import { useEffect, useState } from "react";
import { FiClock, FiCalendar, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityItem {
  id: number;
  userName?: string;
  userEmail?: string;
  clockIn: string;
  clockOut: string | null;
  status: string;
  duration?: string;
}

interface RecentActivityProps {
  is_admin?: boolean;
  compact?: boolean;
}

export default function RecentActivity({
  is_admin = false,
  compact = false,
}: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          throw new Error("No user data found");
        }

        const user = JSON.parse(userData);
        const endpoint = is_admin
          ? "/api/admin/recent-activity"
          : "/api/attendance/recent";

        const response = await fetch(endpoint, {
          headers: {
            "x-user-email": user.email,
            "x-user-ptp": user.ptp || "",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch activity");
        }

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError("Failed to load recent activity");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [is_admin]);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="animate-pulse text-gray-500">Loading activities...</div>
      </div>
    );
  if (error)
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    const today = new Date();
    const activityDate = new Date(date);

    if (activityDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (
      activityDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString()
    ) {
      return "Yesterday";
    }

    return activityDate.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FiClock className="text-blue-500" />
            Activity Log
          </h2>
          {!compact && (
            <button
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              onClick={() => setActivities([])}
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 space-y-1">
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group"
              >
                <div
                  className="py-3 px-3 hover:bg-gray-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-gray-100"
                  onClick={() =>
                    setExpandedId(
                      expandedId === activity.id ? null : activity.id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-110 ${
                          activity.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {is_admin
                            ? activity.userName || "Unknown User"
                            : formatDate(activity.clockIn)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {is_admin
                            ? activity.userEmail
                            : formatTime(activity.clockIn)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all
                        ${
                          activity.status === "Active"
                            ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 group-hover:bg-gray-200"
                        }`}
                      >
                        {activity.status === "Active" ? (
                          <FiArrowUp className="mr-1.5 h-3 w-3" />
                        ) : (
                          <FiArrowDown className="mr-1.5 h-3 w-3" />
                        )}
                        {activity.status}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === activity.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 ml-5 pl-3 border-l-2 border-gray-200"
                      >
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <span className="text-gray-500">Clock In:</span>
                            {new Date(activity.clockIn).toLocaleString()}
                          </p>
                          {activity.clockOut && (
                            <>
                              <p className="flex items-center gap-2">
                                <span className="text-gray-500">
                                  Clock Out:
                                </span>
                                {new Date(activity.clockOut).toLocaleString()}
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-gray-500">Duration:</span>
                                {activity.duration}
                              </p>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FiClock className="w-12 h-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium">No activity yet</p>
              <p className="text-sm">Recent activities will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
