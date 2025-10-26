import React, { useState } from "react";
import { useRouter } from "next/router";

export default function AddTransaction() {
  const [form, setForm] = useState({
    date: "",
    customer: "",
    description: "",
    amount: "",
    status: "completed",
    type: "income",
    category: "daily-play",
    course: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("accounting_jwt");
    fetch("http://localhost:3033/api/accounting/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add transaction");
        setMessage(data.message);
        setForm({
          date: "",
          customer: "",
          description: "",
          amount: "",
          status: "completed",
          type: "income",
          category: "daily-play",
          course: "",
        });
      })
      .catch((err) => setMessage(err.message));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Add Transaction</h1>
        <input
          type="date"
          name="date"
          className="mb-3 w-full px-4 py-2 border rounded"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="customer"
          className="mb-3 w-full px-4 py-2 border rounded"
          placeholder="Customer"
          value={form.customer}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          className="mb-3 w-full px-4 py-2 border rounded"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          className="mb-3 w-full px-4 py-2 border rounded"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select
          name="status"
          className="mb-3 w-full px-4 py-2 border rounded"
          value={form.status}
          onChange={handleChange}
        >
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          name="type"
          className="mb-3 w-full px-4 py-2 border rounded"
          value={form.type}
          onChange={handleChange}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          name="category"
          className="mb-3 w-full px-4 py-2 border rounded"
          value={form.category}
          onChange={handleChange}
        >
          <option value="daily-play">Daily Play</option>
          <option value="shootout-tournament">Shootout Tournament</option>
          <option value="course">Course</option>
          <option value="marketing">Marketing</option>
        </select>
        <input
          type="text"
          name="course"
          className="mb-3 w-full px-4 py-2 border rounded"
          placeholder="Course (optional)"
          value={form.course}
          onChange={handleChange}
        />
        {message && <div className="mb-3 text-blue-600 text-sm">{message}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-bold"
        >
          Add Transaction
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
