import React, { useState } from 'react';
import Link from 'next/link';


interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    documentType: 'id' | 'passport' | 'license';
    submittedAt: string;
    reviewedBy?: string;
    reviewedAt?: string;
    notes?: string;
}

export default function Verification() {
    const [users] = useState<User[]>([
        {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            joinDate: '2024-03-15',
            verificationStatus: 'pending',
            documentType: 'license',
            submittedAt: '2024-03-15T14:30:00'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '(555) 234-5678',
            joinDate: '2024-03-14',
            verificationStatus: 'verified',
            documentType: 'id',
            submittedAt: '2024-03-14T09:15:00',
            reviewedBy: 'Admin',
            reviewedAt: '2024-03-14T16:20:00'
        },
        {
            id: 3,
            name: 'Mike Davis',
            email: 'mike@example.com',
            phone: '(555) 345-6789',
            joinDate: '2024-03-13',
            verificationStatus: 'pending',
            documentType: 'passport',
            submittedAt: '2024-03-13T11:45:00'
        },
        {
            id: 4,
            name: 'Lisa Wilson',
            email: 'lisa@example.com',
            phone: '(555) 456-7890',
            joinDate: '2024-03-12',
            verificationStatus: 'rejected',
            documentType: 'id',
            submittedAt: '2024-03-12T13:00:00',
            reviewedBy: 'Admin',
            reviewedAt: '2024-03-12T17:30:00',
            notes: 'Document image too blurry, please resubmit with clearer photo'
        }
    ]);

    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = users.filter(user => {
        return selectedStatus === 'all' || user.verificationStatus === selectedStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDocumentTypeColor = (type: string) => {
        switch (type) {
            case 'id': return 'bg-blue-100 text-blue-800';
            case 'passport': return 'bg-purple-100 text-purple-800';
            case 'license': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleReview = (user: User) => {
        setSelectedUser(user);
        setShowReviewModal(true);
    };

    const handleApprove = () => {
        if (selectedUser) {
            alert(`User ${selectedUser.name} has been verified successfully!`);
            setShowReviewModal(false);
            setSelectedUser(null);
        }
    };

    const handleReject = () => {
        if (selectedUser) {
            alert(`User ${selectedUser.name} verification has been rejected.`);
            setShowReviewModal(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="mr-4">← Back to Dashboard</Link>
                            <h1 className="text-xl font-bold text-gray-800">User Verification</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/login">Logout</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">User Verification</h2>
                    <p className="text-gray-600">Review and verify user identity documents</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">P</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {users.filter(u => u.verificationStatus === 'pending').length}
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
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">V</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {users.filter(u => u.verificationStatus === 'verified').length}
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
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">R</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {users.filter(u => u.verificationStatus === 'rejected').length}
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
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">T</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                        <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
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
                                    <option value="pending">Pending Review</option>
                                    <option value="verified">Verified</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                    Bulk Approve
                                </button>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                    Export Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Document Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reviewed By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">Joined: {new Date(user.joinDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            <div className="text-sm text-gray-500">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDocumentTypeColor(user.documentType)}`}>
                                                {user.documentType.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(user.submittedAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-500">
                                                {new Date(user.submittedAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.verificationStatus)}`}>
                                                {user.verificationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.reviewedBy ? (
                                                <div>
                                                    <div>{user.reviewedBy}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {user.reviewedAt && new Date(user.reviewedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.verificationStatus === 'pending' ? (
                                                <button
                                                    onClick={() => handleReview(user)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Review
                                                </button>
                                            ) : (
                                                <button className="text-gray-600 hover:text-gray-900">
                                                    View Details
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Review Modal */}
                {showReviewModal && selectedUser && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Review User Verification</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <p className="text-sm text-gray-900">{selectedUser.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Document Type</label>
                                            <p className="text-sm text-gray-900">{selectedUser.documentType.toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                                        <p className="text-sm text-gray-900">
                                            {new Date(selectedUser.submittedAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Document Preview Placeholder */}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <div className="text-gray-400">
                                            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-sm">Document preview would appear here</p>
                                            <p className="text-xs text-gray-500">{selectedUser.documentType.toUpperCase()} Document</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="Add notes about the verification review..."
                                            defaultValue={selectedUser.notes}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={() => setShowReviewModal(false)}
                                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
