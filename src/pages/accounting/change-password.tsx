import React, { useState } from "react";
import { useRouter } from "next/router";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  function handleChange(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("accounting_jwt");
    fetch("http://localhost:3033/api/accounting/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to change password");
        setMessage(data.message);
        setOldPassword("");
        setNewPassword("");
      })
      .catch((err) => setMessage(err.message));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form
        onSubmit={handleChange}
        className="bg-white shadow-lg p-8 rounded w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Change Password</h1>
        <input
          className="mb-3 w-full px-4 py-2 border rounded"
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          className="mb-3 w-full px-4 py-2 border rounded"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {message && <div className="mb-3 text-blue-600 text-sm">{message}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
        >
          Change Password
        </button>
        <button
          type="button"
          className="w-full mt-3 bg-gray-300 text-gray-700 py-2 rounded"
          onClick={() => router.push("/accounting/dashboard")}
        >
          Back to Dashboard
        </button>
      </form>
    </div>
  );
}
