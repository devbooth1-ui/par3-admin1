import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    course: string;
    maxPlayers: number;
    currentPlayers: number;
    price: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    type: 'tournament' | 'lesson' | 'practice' | 'special';
}

type PlayerStats = {
    totalPoints?: number;
};
type Player = {
    _id: string;
    name: string;
    email: string;
    stats?: PlayerStats;
};

export default function Events() {
    const [events] = useState<Event[]>([
        {
            id: 1,
            title: 'Spring Tournament',
            date: '2024-03-20',
            time: '09:00',
            course: 'Sunset Valley Par 3',
            maxPlayers: 32,
            currentPlayers: 28,
            price: 50,
            status: 'upcoming',
            type: 'tournament'
        },
        {
            id: 2,
            title: 'Beginner Golf Lesson',
            date: '2024-03-18',
            time: '14:00',
            course: 'Meadow Brook Par 3',
            maxPlayers: 6,
            currentPlayers: 4,
            price: 75,
            status: 'upcoming',
            type: 'lesson'
        },
        {
            id: 3,
            title: 'Weekend Challenge',
            date: '2024-03-15',
            time: '10:00',
            course: 'Eagle Ridge Challenge',
            maxPlayers: 20,
            currentPlayers: 20,
            price: 35,
            status: 'completed',
            type: 'tournament'
        },
        {
            id: 4,
            title: 'Ladies Night Special',
            date: '2024-03-22',
            time: '18:00',
            course: 'Lakeside Challenge',
            maxPlayers: 16,
            currentPlayers: 12,
            price: 30,
            status: 'upcoming',
            type: 'special'
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    // --- Bulk Email Feature ---
    const [players, setPlayers] = useState<Player[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [sendingBulk, setSendingBulk] = useState(false);
    const [bulkError, setBulkError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/players')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch players');
                return res.json();
            })
            .then(data => {
                setPlayers(data);
                setLoadingPlayers(false);
            })
            .catch(() => {
                setBulkError('Could not load players');
                setLoadingPlayers(false);
            });
    }, []);

    async function sendEventEmailToAll() {
        if (!window.confirm("Send this event email to ALL players?")) return;
        setSendingBulk(true);
        for (const player of players) {
            const points = player.stats?.totalPoints ?? 0;
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: player.email,
                    subject: "You're Invited: Special Par3 Event!",
                    text: `
Hi ${player.name},

You have ${points} points so far!

Let's play toward the $1 Million Dollar Shootout!

See tournament details: https://par3-admin1.vercel.app/tournament-details?player=${player._id}
Find your nearest course: https://par3-admin1.vercel.app/courses?player=${player._id}

Don't miss this special event!
                    `,
                    html: `
<h2>Hi ${player.name},</h2>
<p>You have <strong>${points}</strong> points so far!</p>
<p>Let's play toward the <strong>$1 Million Dollar Shootout!</strong></p>
<p>
  <a href="https://par3-admin1.vercel.app/tournament-details?player=${player._id}" style="background:#048e27;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Tournament Details</a>
</p>
<p>
  <a href="https://par3-admin1.vercel.app/courses?player=${player._id}" style="background:#0d6efd;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Find Your Nearest Course</a>
</p>
<br>
<p>Don't miss this special event!</p>
                    `
                })
            });
        }
        setSendingBulk(false);
        alert("Special event emails sent to all players!");
    }

    const filteredEvents = events.filter(event => {
        const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
        const matchesType = selectedType === 'all' || event.type === selectedType;
        return matchesStatus && matchesType;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'tournament': return 'bg-purple-100 text-purple-800';
            case 'lesson': return 'bg-green-100 text-green-800';
            case 'practice': return 'bg-yellow-100 text-yellow-800';
            case 'special': return 'bg-pink-100 text-pink-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-8">
                {/* Navigation */}
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <a href="/dashboard">← Back to Dashboard</a>
                                <h1 className="text-xl font-bold text-gray-800">Event Management</h1>
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
                        <h2 className="text-3xl font-bold text-gray-900">Event Management</h2>
                        <p className="text-gray-600">Create and manage tournaments, lessons, and special events</p>
                    </div>

                    {/* Bulk Email Button */}
                    <div className="mb-8">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold"
                            onClick={sendEventEmailToAll}
                            disabled={sendingBulk || loadingPlayers || players.length === 0}
                        >
                            {sendingBulk ? "Sending..." : "Send Special Event Email to All Players"}
                        </button>
                        {loadingPlayers && <div className="text-gray-600 mt-2">Loading player list...</div>}
                        {bulkError && <div className="text-red-600 mt-2">{bulkError}</div>}
                        {!loadingPlayers && players.length > 0 && (
                            <div className="mt-2 text-sm text-gray-700">
                                Players who will receive the email:
                                <ul>
                                    {players.map(player => (
                                        <li key={player._id}>
                                            {player.name} ({player.email}) — Points: {player.stats?.totalPoints ?? 0}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">E</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                                            <dd className="text-lg font-medium text-gray-900">{events.length}</dd>
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
                                            <span className="text-white text-sm font-bold">U</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {events.filter(e => e.status === 'upcoming').length}
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Players</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {events.reduce((sum, e) => sum + e.currentPlayers, 0)}
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                ${events.reduce((sum, e) => sum + (e.currentPlayers * e.price), 0).toLocaleString()}
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
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="tournament">Tournaments</option>
                                        <option value="lesson">Lessons</option>
                                        <option value="practice">Practice</option>
                                        <option value="special">Special Events</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Create Event
                                    </button>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                                        Export Calendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Date:</span>
                                            <span className="text-sm text-gray-900">{new Date(event.date).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Time:</span>
                                            <span className="text-sm text-gray-900">{event.time}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Course:</span>
                                            <span className="text-sm text-gray-900">{event.course}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Type:</span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>
                                                {event.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Players:</span>
                                            <span className="text-sm text-gray-900">{event.currentPlayers}/{event.maxPlayers}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Price:</span>
                                            <span className="text-sm font-medium text-gray-900">${event.price}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                            <span>Registration</span>
                                            <span>{Math.round((event.currentPlayers / event.maxPlayers) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(event.currentPlayers / event.maxPlayers) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex space-x-3">
                                        <button className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded hover:bg-blue-600">
                                            Edit Event
                                        </button>
                                        <button className="flex-1 bg-gray-500 text-white text-sm py-2 px-3 rounded hover:bg-gray-600">
                                            View Players
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Event Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Event</h3>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter event title"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="tournament">Tournament</option>
                                                <option value="lesson">Lesson</option>
                                                <option value="practice">Practice</option>
                                                <option value="special">Special Event</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="Sunset Valley Par 3">Sunset Valley Par 3</option>
                                                <option value="Eagle Ridge Challenge">Eagle Ridge Challenge</option>
                                                <option value="Meadow Brook Par 3">Meadow Brook Par 3</option>
                                                <option value="Lakeside Challenge">Lakeside Challenge</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="35"
                                                />
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
                                                alert('Event created successfully!');
                                            }}
                                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                        >
                                            Create Event
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
