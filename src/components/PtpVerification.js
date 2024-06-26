import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { getAuthHeader, setUserData } from "../utils/auth";

export default function PtpVerification() {
  const [ptp, setPtp] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/verify-ptp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({ ptp }),
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch(setUser(userData));
        setUserData(userData);
      } else {
        // Handle error
        console.error("PTP verification failed");
      }
    } catch (error) {
      console.error("Network error", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={ptp}
        onChange={(e) => setPtp(e.target.value)}
        placeholder="Enter PTP"
        required
      />
      <button type="submit">Verify PTP</button>
    </form>
  );
}
