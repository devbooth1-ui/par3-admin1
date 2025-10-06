import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';


interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
    joinDate: string;
    lastActivity: string;
    totalBookings: number;
    status: 'active' | 'inactive' | 'suspended';
}

export default function CRM() {
    const router = useRouter();
    // Accept both ?course=idx and ?courseIdx=idx for flexibility
    const courseIdx = router.query.course ?? router.query.courseIdx;
    let course = null;
    if (typeof window !== 'undefined' && courseIdx !== undefined) {
        const stored = JSON.parse(localStorage.getItem('courses') || '[]');
        course = stored[Number(courseIdx)] || null;
    }

    // Fetch customers/players from backend
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        fetch('/api/players')
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(() => setCustomers([]));
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: '',
        joinDate: '',
        lastActivity: '',
        totalBookings: 0,
        status: 'active',
    });
    const [courseNotes, setCourseNotes] = useState(course?.notes || "");
    const [editingCourse, setEditingCourse] = useState(false);

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAddCustomer = () => {
        setShowAddModal(true);
        setNewCustomer({
            name: '',
            email: '',
            phone: '',
            company: '',
            notes: '',
            joinDate: new Date().toISOString().slice(0, 10),
            lastActivity: new Date().toISOString().slice(0, 10),
            totalBookings: 0,
            status: 'active',
        });
    };

    const handleSaveCustomer = () => {
        setCustomers([
            ...customers,
            {
                ...newCustomer,
                id: customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1,
            },
        ]);
        setShowAddModal(false);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-8">
                {/* Show course info if available */}
                {course && (
                    <div className="mb-6 p-4 bg-blue-50 rounded shadow">
                        <h2 className="text-xl font-bold text-blue-900 mb-2">Course: {course.name}</h2>
                        <div className="text-sm text-gray-700">Hole: {course.holeNumber} | Yardage: {course.yardage}</div>
                        <div className="text-sm text-gray-700">Phone: {course.phone || 'N/A'} | Email: {course.email || 'N/A'}</div>
                        <div className="text-sm text-gray-700">Address: {course.address || 'N/A'}, {course.city || ''}</div>
                    </div>
                )}

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
                        <h2 className="text-3xl font-bold text-gray-900">Customer Management</h2>
                        <p className="text-gray-600">Manage and track your PAR3 Challenge customers</p>
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                                            <dd className="text-lg font-medium text-gray-900">{customers.length}</dd>
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {customers.filter(c => c.status === 'active').length}
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
                                            <span className="text-white text-sm font-bold">B</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {customers.reduce((sum, c) => sum + c.totalBookings, 0)}
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
                                            <span className="text-white text-sm font-bold">N</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">New This Month</dt>
                                            <dd className="text-lg font-medium text-gray-900">8</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div className="flex-1 max-w-lg">
                                    <input
                                        type="text"
                                        placeholder="Search customers by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={handleAddCustomer}>
                                        Add Customer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Join Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Activity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bookings
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Show course info as a row if available */}
                                    {course && (
                                        <tr className="bg-blue-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-blue-900">{course.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{course.email || "N/A"}</div>
                                                <div className="text-sm text-gray-500">{course.phone || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.holeNumber || "N/A"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.yardage || "N/A"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Course</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => setEditingCourse(true)}>Edit</button>
                                            </td>
                                        </tr>
                                    )}
                                    {/* Show editable notes field for course */}
                                    {editingCourse && course && (
                                        <tr className="bg-blue-50">
                                            <td colSpan={7} className="px-6 py-4">
                                                <div className="mb-2 font-semibold">Course Notes:</div>
                                                <textarea
                                                    className="w-full p-2 border rounded"
                                                    value={courseNotes}
                                                    onChange={e => setCourseNotes(e.target.value)}
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => { setEditingCourse(false); course.notes = courseNotes; }}>Save</button>
                                                    <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setEditingCourse(false)}>Cancel</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {/* Existing customer rows */}
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.email}</div>
                                                <div className="text-sm text-gray-500">{customer.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(customer.joinDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(customer.lastActivity).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {customer.totalBookings}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                                                    {customer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                                <button className="text-red-600 hover:text-red-900">Suspend</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Customer</h2>
                        <input className="w-full mb-2 p-2 border rounded" placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                        <input className="w-full mb-2 p-2 border rounded" placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                        <input className="w-full mb-2 p-2 border rounded" placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                        <input className="w-full mb-2 p-2 border rounded" placeholder="Company" value={newCustomer.company} onChange={e => setNewCustomer({ ...newCustomer, company: e.target.value })} />
                        <textarea className="w-full mb-2 p-2 border rounded" placeholder="Notes" value={newCustomer.notes} onChange={e => setNewCustomer({ ...newCustomer, notes: e.target.value })} />
                        <div className="flex gap-2 mt-4">
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleSaveCustomer}>Save</button>
                            <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setShowAddModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
