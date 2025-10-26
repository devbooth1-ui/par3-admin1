import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Types for summary data
type Summary = {
  totalRevenue: number;
  revenueByCourse: Record<string, number>;
  marketingRevenue: number;
  totalExpenses: number;
  netProfit: number;
  transactions: any[];
};

export default function AccountingDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accounting_jwt");
    if (!token) {
      router.replace("/accounting/login");
      return;
    }
    fetch("http://localhost:3033/api/accounting/summary", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized or error loading summary");
        return res.json();
      })
      .then(setSummary)
      .catch((err) => setError(err.message));
  }, []);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!summary)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Accounting Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card label="Total Revenue" value={summary.totalRevenue} color="green" />
        <Card label="Marketing Revenue" value={summary.marketingRevenue} color="purple" />
        <Card label="Total Expenses" value={summary.totalExpenses} color="red" />
        <Card label="Net Profit" value={summary.netProfit} color="blue" />
      </div>
      <h2 className="text-xl font-bold mb-4">Revenue by Course</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.entries(summary.revenueByCourse).map(([course, value]) => (
          <Card key={course} label={course} value={value} color="yellow" />
        ))}
      </div>
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Desc</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Course</th>
              <th className="px-3 py-2">Amt</th>
            </tr>
          </thead>
          <tbody>
            {summary.transactions.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-3 py-2">{t.date}</td>
                <td className="px-3 py-2">{t.customer}</td>
                <td className="px-3 py-2">{t.description}</td>
                <td className="px-3 py-2">{t.type}</td>
                <td className="px-3 py-2">{t.category}</td>
                <td className="px-3 py-2">{t.course}</td>
                <td className="px-3 py-2">${t.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-8 flex gap-4">
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded"
          onClick={() => router.push("/accounting/change-password")}
        >
          Change Password
        </button>
        <button
          className="px-5 py-2 bg-green-600 text-white rounded"
          onClick={() => router.push("/accounting/add-transaction")}
        >
          Add Transaction
        </button>
      </div>
    </div>
  );
}

function Card({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-200 text-green-800",
    red: "bg-red-200 text-red-800",
    blue: "bg-blue-200 text-blue-800",
    purple: "bg-purple-200 text-purple-800",
    yellow: "bg-yellow-200 text-yellow-800",
  };
  return (
    <div className={`rounded shadow p-5 font-bold ${colorMap[color]}`}>
      <div className="text-sm mb-1">{label}</div>
      <div className="text-xl">${value.toFixed(2)}</div>
    </div>
  );
}
