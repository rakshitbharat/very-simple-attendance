import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function PtpVerification() {
  const [ptp, setPtp] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/verify-ptp",
        { ptp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        // Handle successful PTP verification (e.g., update UI, store new PTP)
        console.log("New PTP:", response.data.newPtp);
      }
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("PTP verification failed:", error);
    }
  };

  if (!session) return null;

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
