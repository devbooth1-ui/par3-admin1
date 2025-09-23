import React, { useState } from 'react';

// This file is a duplicate of courses.tsx and is not used. Safe to remove or ignore.

// Course object structure:
// { id: number, name: string, location: string, holes: number, par: number, 
//   difficulty: 'Easy'|'Medium'|'Hard', status: 'active'|'maintenance'|'closed', 
//   price: number, description: string }

export default function Courses() {
    const [courses] = useState([
        {
            id: 1,
            name: 'Sunset Valley Par 3',
            location: 'Valley Course, Hole 7',
            holes: 1,
            par: 3,
            difficulty: 'Medium',
            status: 'active',
            price: 25,
            description: 'Beautiful par 3 with water hazard and elevated green'
        },
        {
            id: 2,
            name: 'Eagle Ridge Challenge',
            location: 'Ridge Course, Hole 12',
            holes: 1,
            par: 3,
            difficulty: 'Hard',
            status: 'active',
            price: 35,
            description: 'Challenging uphill par 3 with bunkers and wind'
        },
        {
            id: 3,
            name: 'Meadow Brook Par 3',
            location: 'Meadow Course, Hole 5',
            holes: 1,
            par: 3,
            difficulty: 'Easy',
            status: 'maintenance',
            price: 20,
            description: 'Gentle par 3 perfect for beginners'
        },
        {
            id: 4,
            name: 'Lakeside Challenge',
            location: 'Lake Course, Hole 16',
            holes: 1,
            par: 3,
            difficulty: 'Hard',
            status: 'active',
            price: 40,
            description: 'Island green par 3 - ultimate precision test'
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    const filteredCourses = courses.filter(course => {
        return selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <a href="/dashboard">← Back to Dashboard</a>
                            <h1 className="text-xl font-bold text-gray-800">Course Management</h1>
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
                    <h2 className="text-3xl font-bold text-gray-900">Course Management</h2>
                    <p className="text-gray-600">Manage your PAR3 Challenge golf courses and holes</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">C</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                                        <dd className="text-lg font-medium text-gray-900">{courses.length}</dd>
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
                                        <dt className="text-sm font-medium text-gray-500 truncate">Active Courses</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {courses.filter(c => c.status === 'active').length}
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
                                        <span className="text-white text-sm font-bold">$</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Avg. Price</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            ${(courses.reduce((sum, c) => sum + c.price, 0) / courses.length).toFixed(0)}
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
                                        <span className="text-white text-sm font-bold">M</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Maintenance</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {courses.filter(c => c.status === 'maintenance').length}
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
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Difficulties</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Add New Course
                                </button>
                                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                    Bulk Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                                        {course.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Location:</span>
                                        <span className="text-sm text-gray-900">{course.location}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Par:</span>
                                        <span className="text-sm text-gray-900">{course.par}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Difficulty:</span>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(course.difficulty)}`}>
                                            {course.difficulty}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Price:</span>
                                        <span className="text-sm font-medium text-gray-900">${course.price}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mt-4">{course.description}</p>

                                <div className="mt-6 flex space-x-3">
                                    <button className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded hover:bg-blue-600">
                                        Edit Course
                                    </button>
                                    <button className="flex-1 bg-gray-500 text-white text-sm py-2 px-3 rounded hover:bg-gray-600">
                                        View Stats
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Course Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Course</h3>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter course name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Course location"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Par</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="3"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="25"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                                placeholder="Course description"
                                            ></textarea>
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
                                                alert('Course added successfully!');
                                            }}
                                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                        >
                                            Add Course
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
