import React, { useState } from "react";

export default function AccountingLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    fetch("http://localhost:3033/api/accounting/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).message || "Login failed");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("accounting_jwt", data.token);
        window.location.href = "/accounting/dashboard";
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Accounting Login</h1>
        <input
          className="mb-3 w-full px-4 py-2 border rounded"
          type="text"
          placeholder="Username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="mb-3 w-full px-4 py-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
