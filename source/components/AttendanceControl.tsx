"use client";

import { useState, useEffect } from "react";
import { eventEmitter } from "@/lib/events";

interface AttendanceControlProps {
  userId: number;
}

export function AttendanceControl({ userId }: AttendanceControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastAction, setLastAction] = useState<Date | null>(null);

  useEffect(() => {
    checkCurrentStatus();
  }, [userId]);

  const checkCurrentStatus = async () => {
    try {
      const response = await fetch("/api/attendance/status");
      if (response.ok) {
        const data = await response.json();
        setIsClockedIn(data.isClockedIn);
        if (data.lastAction) {
          setLastAction(new Date(data.lastAction));
        }
      }
    } catch (error) {
      console.error("Error checking attendance status:", error);
    }
  };

  const handleClockAction = async (action: "in" | "out") => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/attendance/clock-${action}`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setIsClockedIn(action === "in");
        setLastAction(new Date(data.timestamp));
        eventEmitter.emit("attendanceUpdated");
      } else {
        setError(data.error || `Failed to clock ${action}`);
      }
    } catch (error) {
      console.error(`Clock ${action} error:`, error);
      setError(`An error occurred while clocking ${action}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Attendance Control</h2>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <div className="flex flex-col space-y-4">
        <div className="text-sm text-gray-600">
          Status: {isClockedIn ? "Clocked In" : "Clocked Out"}
        </div>
        {lastAction && (
          <div className="text-sm text-gray-600">
            Last action: {lastAction.toLocaleString()}
          </div>
        )}
        <button
          onClick={() => handleClockAction(isClockedIn ? "out" : "in")}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isClockedIn
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } disabled:opacity-50`}
        >
          {isLoading ? "Processing..." : isClockedIn ? "Clock Out" : "Clock In"}
        </button>
      </div>
    </div>
  );
}
