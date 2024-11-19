"use client";

import { useState, useEffect } from "react";

interface PTPValidationProps {
  email: string;
  password: string;
  onValidated: (ptp: string) => void;
  onCancel: () => void;
}

export function PTPValidation({
  email,
  password,
  onValidated,
  onCancel,
}: PTPValidationProps) {
  const [ptp, setPtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPtp, setNewPtp] = useState<string | null>(null);

  useEffect(() => {
    validatePTP();
  }, [email, password]);

  const validatePTP = async () => {
    try {
      const response = await fetch("/api/validate-ptp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: email,
          password: password,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to validate PTP");
      }

      if (data.valid) {
        // PTP is valid, notify parent
        onValidated(data.ptp);
      } else {
        // New PTP needed
        setNewPtp(data.newPtp);
      }
    } catch (error) {
      console.error("PTP validation error:", error);
      setError("Failed to validate PTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (ptp !== newPtp) {
      setError("Invalid PTP number");
      return;
    }

    onValidated(ptp);
  };

  if (loading) {
    return <div>Validating PTP...</div>;
  }

  if (!newPtp) {
    return <div>Error: No PTP available</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Enter PTP Number</h2>
        <p className="text-gray-600 mb-4">
          Your new PTP number is: <strong>{newPtp}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PTP Number
            </label>
            <input
              type="text"
              maxLength={4}
              value={ptp}
              onChange={(e) => setPtp(e.target.value.replace(/\D/g, ""))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter 4-digit PTP"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Validate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
