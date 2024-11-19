"use client";

import { useState, useEffect } from "react";
import { eventEmitter } from "@/lib/events";

interface AttendanceRecord {
  id: number;
  clock_in: string;
  clock_out: string | null;
}

interface RecentActivityProps {
  userId: number;
}

export function RecentActivity({ userId }: RecentActivityProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attendance/recent?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch activity");
      const data = await response.json();
      setRecords(data.records);
      setError("");
    } catch (err) {
      setError("Failed to load recent activity");
      console.error("Error fetching recent activity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();

    // Subscribe to attendance updates
    const handleAttendanceUpdate = () => {
      fetchRecentActivity();
    };

    eventEmitter.on("attendanceUpdated", handleAttendanceUpdate);

    // Cleanup subscription
    return () => {
      eventEmitter.off("attendanceUpdated", handleAttendanceUpdate);
    };
  }, [userId]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return "In Progress";
    const start = new Date(clockIn).getTime();
    const end = new Date(clockOut).getTime();
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <div>Loading activity...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {records.length === 0 ? (
        <p className="text-gray-500">No recent activity</p>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white p-4 rounded-md shadow border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    Clock In: {formatDateTime(record.clock_in)}
                  </div>
                  {record.clock_out && (
                    <div className="text-gray-600">
                      Clock Out: {formatDateTime(record.clock_out)}
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold text-blue-600">
                  {calculateDuration(record.clock_in, record.clock_out)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
