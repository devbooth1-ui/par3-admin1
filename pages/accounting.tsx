import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

const CATEGORY_OPTIONS = [
    { value: 'all', label: 'All Categories' },
    { value: 'shootout-tournament', label: 'Shootout Tournament' },
    { value: 'daily-play', label: 'Daily Play' },
    { value: 'course', label: 'Course Revenue/Expense' },
    { value: 'marketing', label: 'Marketing Revenue' },
];

function getStatusStyles(status: string) {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'failed':
            return 'bg-red-100 text-red-800 border-red-300';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}
function getTypeLabel(type: string) {
    return (
        <span
            className={`font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
        >
            {type === 'income' ? '+ Income' : '- Expense'}
        </span>
    );
}

interface SummaryCardProps {
    color: string;
    icon: React.ReactNode;
    label: string;
    value: number | string;
    valueClass?: string;
}
function SummaryCard({ color, icon, label, value, valueClass = '' }: SummaryCardProps) {
    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg flex items-center px-5 py-4 gap-4">
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${color} shadow text-white text-2xl font-black`}
            >
                {icon}
            </div>
            <div>
                <div className="text-sm text-gray-500 font-medium">{label}</div>
                <div className={`text-xl font-extrabold ${valueClass}`}>
                    {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
                </div>
            </div>
        </div>
    );
}

interface ThProps {
    children: React.ReactNode;
}
function Th({ children }: ThProps) {
    return (
        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50">
            {children}
        </th>
    );
}

interface TdProps {
    children: React.ReactNode;
    className?: string;
}
function Td({ children, className = '' }: TdProps) {
    return (
        <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
    );
}

export default function Accounting() {
    const [transactionType, setTransactionType] = useState('all');
    const [dateRange, setDateRange] = useState('thisMonth');
    const [category, setCategory] = useState('all');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTransactions() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/accounting');
                if (!res.ok) throw new Error('Failed to fetch transactions');
                const data = await res.json();
                setTransactions(data.transactions || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(
        (t) =>
            (transactionType === 'all' || t.type === transactionType) &&
            (category === 'all' || t.category === category)
    );

    const totalIncome = filteredTransactions
        .filter((t) => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
        .filter((t) => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpenses;

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-8">
                {/* Page Title & Info */}
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-blue-900 mb-1">
                        Financial Reports
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Track revenue, expenses, and financial performance
                    </p>
                </div>

                {/* Summary Cards */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <SummaryCard
                        color="bg-green-500"
                        icon="$"
                        label="Total Income"
                        value={totalIncome}
                        valueClass="text-green-700"
                    />
                    <SummaryCard
                        color="bg-red-500"
                        icon="-"
                        label="Total Expenses"
                        value={totalExpenses}
                        valueClass="text-red-700"
                    />
                    <SummaryCard
                        color={
                            netProfit >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                        }
                        icon="±"
                        label="Net Profit"
                        value={Math.abs(netProfit)}
                        valueClass={
                            netProfit >= 0
                                ? 'text-green-700'
                                : 'text-red-700'
                        }
                    />
                    <SummaryCard
                        color="bg-purple-500"
                        icon="#"
                        label="Transactions"
                        value={filteredTransactions.length}
                    />
                </section>

                {/* Filters & Actions */}
                <section className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white border border-gray-200 shadow rounded-lg">
                        <div className="flex gap-4 items-center">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                            >
                                <option value="thisMonth">This Month</option>
                                <option value="thisWeek">This Week</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="thisYear">This Year</option>
                            </select>
                            <select
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                            >
                                <option value="all">All Transactions</option>
                                <option value="income">Income Only</option>
                                <option value="expense">Expenses Only</option>
                            </select>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                            >
                                {CATEGORY_OPTIONS.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-5 py-2 rounded-md bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">
                                Export Report
                            </button>
                            <button className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
                                Add Transaction
                            </button>
                        </div>
                    </div>
                </section>

                {/* Transactions Table */}
                <section className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Recent Transactions
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading transactions...</div>
                        ) : error ? (
                            <div className="p-8 text-center text-red-500">{error}</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 text-base">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <Th>Date</Th>
                                        <Th>Customer/Vendor</Th>
                                        <Th>Description</Th>
                                        <Th>Type</Th>
                                        <Th>Category</Th>
                                        <Th>Amount</Th>
                                        <Th>Status</Th>
                                        <Th>Actions</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((t, idx) => (
                                        <tr
                                            key={t.id}
                                            className={
                                                idx % 2 === 0
                                                    ? 'bg-white hover:bg-blue-50'
                                                    : 'bg-blue-50 hover:bg-blue-100'
                                            }
                                        >
                                            <Td>
                                                {new Date(t.date).toLocaleDateString()}
                                            </Td>
                                            <Td className="font-medium">{t.customer}</Td>
                                            <Td>{t.description}</Td>
                                            <Td>{getTypeLabel(t.type)}</Td>
                                            <Td>
                                                <span className="px-2 py-1 rounded bg-gray-100 text-xs font-bold">
                                                    {CATEGORY_OPTIONS.find(c => c.value === t.category)?.label || t.category}
                                                </span>
                                            </Td>
                                            <Td className="font-bold">
                                                ${t.amount.toFixed(2)}
                                            </Td>
                                            <Td>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded border text-xs font-bold ${getStatusStyles(
                                                        t.status
                                                    )}`}
                                                >
                                                    {t.status}
                                                </span>
                                            </Td>
                                            <Td>
                                                <button
                                                    className="text-blue-700 font-bold hover:underline mr-2"
                                                    title="View"
                                                >
                                                    <svg
                                                        className="inline w-5 h-5 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View
                                                </button>
                                                <button
                                                    className="text-green-700 font-bold hover:underline"
                                                    title="Edit"
                                                >
                                                    <svg
                                                        className="inline w-5 h-5 mr-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
