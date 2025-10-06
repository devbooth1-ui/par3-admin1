import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import Link from 'next/link';


interface Special {
    id: number;
    title: string;
    description: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    validFrom: string;
    validUntil: string;
    status: 'active' | 'inactive' | 'expired';
    usageCount: number;
    maxUsage?: number;
    code?: string;
    applicableCourses: string[];
}

export default function Specials() {
    const [specials] = useState<Special[]>([
        {
            id: 1,
            title: 'Spring Break Special',
            description: 'Get 20% off all bookings during spring break week',
            discount: 20,
            discountType: 'percentage',
            validFrom: '2024-03-15',
            validUntil: '2024-03-22',
            status: 'active',
            usageCount: 45,
            maxUsage: 100,
            code: 'SPRING20',
            applicableCourses: ['All Courses']
        },
        {
            id: 2,
            title: 'Weekend Warrior',
            description: '$10 off weekend bookings for returning players',
            discount: 10,
            discountType: 'fixed',
            validFrom: '2024-03-01',
            validUntil: '2024-03-31',
            status: 'active',
            usageCount: 23,
            maxUsage: 50,
            code: 'WEEKEND10',
            applicableCourses: ['Sunset Valley Par 3', 'Eagle Ridge Challenge']
        },
        {
            id: 3,
            title: 'First Time Player',
            description: 'New players get 50% off their first booking',
            discount: 50,
            discountType: 'percentage',
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            status: 'active',
            usageCount: 127,
            code: 'NEWBIE50',
            applicableCourses: ['Meadow Brook Par 3']
        },
        {
            id: 4,
            title: 'Valentine Special',
            description: 'Couples booking - 30% off for two players',
            discount: 30,
            discountType: 'percentage',
            validFrom: '2024-02-10',
            validUntil: '2024-02-18',
            status: 'expired',
            usageCount: 18,
            maxUsage: 25,
            code: 'LOVE30',
            applicableCourses: ['All Courses']
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');

    const filteredSpecials: Special[] = specials
        .filter(special => selectedStatus === 'all' || special.status === selectedStatus)
        .map(special => {
            let discountType: 'fixed' | 'percentage' = 'fixed';
            if (special.discountType === 'fixed') discountType = 'fixed';
            else if (special.discountType === 'percentage') discountType = 'percentage';
            // fallback to 'fixed' if not valid
            return {
                ...special,
                discountType,
            };
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-yellow-100 text-yellow-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDiscountText = (special: Special) => {
        return special.discountType === 'percentage'
            ? `${special.discount}% off`
            : `$${special.discount} off`;
    };

    const getUsagePercentage = (special: Special) => {
        if (!special.maxUsage) return 0;
        return (special.usageCount / special.maxUsage) * 100;
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-8">
                {/* Navigation */}
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href="/dashboard" className="mr-4 text-blue-600 hover:underline">← Back to Dashboard</Link>
                                <h1 className="text-xl font-bold text-gray-800">Customer Management</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                                <Link href="/login" className="text-blue-600 hover:underline">Logout</Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Special Offers Management</h2>
                        <p className="text-gray-600">Create and manage promotional offers and discount codes</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">S</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Specials</dt>
                                            <dd className="text-lg font-medium text-gray-900">{specials.length}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">A</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Active Offers</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {specials.filter(s => s.status === 'active').length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">U</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Uses</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {specials.reduce((sum, s) => sum + s.usageCount, 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">$</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Est. Savings</dt>
                                            <dd className="text-lg font-medium text-gray-900">$2,847</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Actions */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Create Special Offer
                                    </button>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                        Generate Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSpecials.map((special) => (
                            <div key={special.id} className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">{special.title}</h3>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(special.status)}`}>
                                            {special.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-4">{special.description}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Discount:</span>
                                            <span className="text-sm font-medium text-green-600">{getDiscountText(special)}</span>
                                        </div>

                                        {special.code && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Code:</span>
                                                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{special.code}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Valid From:</span>
                                            <span className="text-sm text-gray-900">{new Date(special.validFrom).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Valid Until:</span>
                                            <span className="text-sm text-gray-900">{new Date(special.validUntil).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Usage:</span>
                                            <span className="text-sm text-gray-900">
                                                {special.usageCount}{special.maxUsage ? `/${special.maxUsage}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Usage Progress Bar */}
                                    {special.maxUsage && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                                <span>Usage Progress</span>
                                                <span>{Math.round(getUsagePercentage(special))}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${getUsagePercentage(special)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Applicable Courses */}
                                    <div className="mt-4">
                                        <span className="text-sm text-gray-500">Courses:</span>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {special.applicableCourses.map((course, index) => (
                                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex space-x-3">
                                        <button className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded hover:bg-blue-600">
                                            Edit Special
                                        </button>
                                        <button className="flex-1 bg-gray-500 text-white text-sm py-2 px-3 rounded hover:bg-gray-600">
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Special Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Create Special Offer</h3>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter special offer title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                                placeholder="Describe your special offer"
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="percentage">Percentage</option>
                                                    <option value="fixed">Fixed Amount</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="20"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code (Optional)</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="SAVE20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Usage (Optional)</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="100"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Courses</label>
                                            <div className="space-y-2">
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                                    <span className="ml-2 text-sm text-gray-700">All Courses</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                                    <span className="ml-2 text-sm text-gray-700">Sunset Valley Par 3</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                                    <span className="ml-2 text-sm text-gray-700">Eagle Ridge Challenge</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                                    <span className="ml-2 text-sm text-gray-700">Meadow Brook Par 3</span>
                                                </label>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="flex space-x-3 mt-6">
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAddModal(false);
                                                alert('Special offer created successfully!');
                                            }}
                                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                        >
                                            Create Special
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create Campaign Button */}
                    <div className="mt-8">
                        <button
                            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-blue-700"
                            onClick={() => window.open('https://www.canva.com/', '_blank')}
                        >
                            Create Campaign (Open Canva)
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
