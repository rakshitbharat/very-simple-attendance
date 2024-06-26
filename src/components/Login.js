import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ptp, setPtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      ptp,
    });

    if (result.error) {
      // Handle error
    } else {
      // Redirect or update UI
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
