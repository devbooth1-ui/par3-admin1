import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';


interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'email' | 'push' | 'sms';
    status: 'sent' | 'pending' | 'failed' | 'draft';
    recipients: number;
    sentAt?: string;
    createdAt: string;
}

export default function Notifications() {
    const [notifications] = useState([
        {
            id: 1,
            title: 'Spring Tournament Registration Open',
            message: 'Register now for our Spring Tournament on March 20th. Limited spots available!',
            type: 'email',
            status: 'sent',
            recipients: 1247,
            sentAt: '2024-03-15T10:30:00',
            createdAt: '2024-03-15T09:00:00'
        },
        {
            id: 2,
            title: 'Weather Alert - Course Closure',
            message: 'Due to heavy rain, all courses will be closed today. Bookings will be rescheduled.',
            type: 'push',
            status: 'sent',
            recipients: 89,
            sentAt: '2024-03-14T07:00:00',
            createdAt: '2024-03-14T06:45:00'
        },
        {
            id: 3,
            title: 'New Course Feature Announcement',
            message: 'Exciting news! We have added video recording to track your shots. Try it on your next visit.',
            type: 'email',
            status: 'pending',
            recipients: 850,
            createdAt: '2024-03-13T15:20:00'
        },
        {
            id: 4,
            title: 'Weekly Leaderboard Update',
            message: 'Check out this weeks top performers and see where you rank!',
            type: 'push',
            status: 'draft',
            recipients: 0,
            createdAt: '2024-03-12T12:00:00'
        }
    ]);

    const [showComposeModal, setShowComposeModal] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const filteredNotifications = notifications.filter(notification => {
        const matchesType = selectedType === 'all' || notification.type === selectedType;
        const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
        return matchesType && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'email': return 'bg-blue-100 text-blue-800';
            case 'push': return 'bg-purple-100 text-purple-800';
            case 'sms': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-100">
                {/* Navigation */}
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <a href="/dashboard">← Back to Dashboard</a>
                                <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <a href="/dashboard">Dashboard</a>
                                <a href="/login">Logout</a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Notification Management</h2>
                        <p className="text-gray-600">Send and manage notifications to your PAR3 Challenge users</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Sent</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {notifications.filter(n => n.status === 'sent').length}
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
                                            <span className="text-white text-sm font-bold">P</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {notifications.filter(n => n.status === 'pending').length}
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
                                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">D</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {notifications.filter(n => n.status === 'draft').length}
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
                                            <span className="text-white text-sm font-bold">R</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Recipients</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {notifications.reduce((sum, n) => sum + n.recipients, 0).toLocaleString()}
                                            </dd>
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
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="email">Email</option>
                                        <option value="push">Push Notification</option>
                                        <option value="sms">SMS</option>
                                    </select>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="sent">Sent</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setShowComposeModal(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Compose Notification
                                    </button>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                        Schedule Broadcast
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {filteredNotifications.map((notification) => (
                                <div key={notification.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    {notification.title}
                                                </h3>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                                                    {notification.type}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                                                    {notification.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <span>Recipients: {notification.recipients.toLocaleString()}</span>
                                                <span>Created: {new Date(notification.createdAt).toLocaleString()}</span>
                                                {notification.sentAt && (
                                                    <span>Sent: {new Date(notification.sentAt).toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 ml-4">
                                            {notification.status === 'draft' && (
                                                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                                                    Edit
                                                </button>
                                            )}
                                            {notification.status === 'pending' && (
                                                <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                                                    Send Now
                                                </button>
                                            )}
                                            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                                View Details
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compose Notification Modal */}
                    {showComposeModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-2/3 max-w-2xl shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Compose Notification</h3>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter notification title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={4}
                                                placeholder="Enter your message here..."
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="email">Email</option>
                                                    <option value="push">Push Notification</option>
                                                    <option value="sms">SMS</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="all">All Users</option>
                                                    <option value="active">Active Users Only</option>
                                                    <option value="recent">Recent Players</option>
                                                    <option value="tournament">Tournament Participants</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                                <span className="ml-2 text-sm text-gray-700">Schedule for later</span>
                                            </label>
                                        </div>
                                    </form>

                                    <div className="flex space-x-3 mt-6">
                                        <button
                                            onClick={() => setShowComposeModal(false)}
                                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowComposeModal(false);
                                                alert('Notification saved as draft!');
                                            }}
                                            className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                                        >
                                            Save Draft
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowComposeModal(false);
                                                alert('Notification sent successfully!');
                                            }}
                                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                        >
                                            Send Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
