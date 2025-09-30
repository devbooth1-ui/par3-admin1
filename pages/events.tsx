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
  notes?: string;
  imageURL?: string;
  canvaURL?: string;
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
  const [events, setEvents] = useState<Event[]>([
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
      type: 'tournament',
      notes: 'Kick off the season!',
      imageURL: '',
      canvaURL: '',
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
      type: 'lesson',
      notes: 'Perfect for newcomers.',
      imageURL: '',
      canvaURL: '',
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
      type: 'tournament',
      notes: '',
      imageURL: '',
      canvaURL: '',
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
      type: 'special',
      notes: 'Fun for all skill levels.',
      imageURL: '',
      canvaURL: '',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [newEvent, setNewEvent] = useState<Event>({
    id: events.length + 1,
    title: '',
    date: '',
    time: '',
    course: '',
    maxPlayers: 0,
    currentPlayers: 0,
    price: 0,
    status: 'upcoming',
    type: 'tournament',
    notes: '',
    imageURL: '',
    canvaURL: '',
  });
  const [templateEvents, setTemplateEvents] = useState<Event[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  // Bulk Email Feature
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setEvents(prev => [...prev, { ...newEvent, id: prev.length + 1 }]);
    setShowAddModal(false);
    setNewEvent({
      id: events.length + 2,
      title: '',
      date: '',
      time: '',
      course: '',
      maxPlayers: 0,
      currentPlayers: 0,
      price: 0,
      status: 'upcoming',
      type: 'tournament',
      notes: '',
      imageURL: '',
      canvaURL: '',
    });
  };

  const deleteEvent = (id: number) => {
    if (window.confirm("Delete this event?")) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
    }
  };

  const saveTemplate = (event: Event) => {
    setTemplateEvents(prev => [...prev, event]);
    alert("Event template saved!");
  };

  const loadTemplate = (template: Event) => {
    setNewEvent({ ...template, id: events.length + 1 });
    setShowTemplates(false);
    setShowAddModal(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Navigation */}
        <nav className="bg-white shadow-lg mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/dashboard" className="mr-4">← Back to Dashboard</a>
                <h1 className="text-xl font-bold text-gray-800">Event Management</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/dashboard">Dashboard</a>
                <a href="/login">Logout</a>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

          {/* Only show Total Events card */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer" onClick={() => setSelectedStatus('all')}>
              <div className="p-5 flex items-center">
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

          {/* Actions */}
          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Create Event
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              {showTemplates ? "Hide Templates" : "Show Templates"}
            </button>
          </div>

          {/* Templates Modal */}
          {showTemplates && (
            <div className="bg-white shadow rounded-lg mb-8 p-6">
              <h2 className="text-xl font-bold mb-4">Event Templates</h2>
              {templateEvents.length === 0 ? (
                <div>No templates saved yet.</div>
              ) : (
                templateEvents.map(template => (
                  <div key={template.id} className="border-b pb-4 mb-4">
                    <div className="font-semibold">{template.title}</div>
                    <div className="text-sm text-gray-500">{template.date} at {template.time} — {template.course}</div>
                    <div className="mb-2">{template.notes}</div>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => loadTemplate(template)}
                    >
                      Use Template
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">{event.date} at {event.time}</div>
                    <div className="text-sm text-gray-500">{event.course}</div>
                    <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>
                      {event.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      Players: {event.currentPlayers}/{event.maxPlayers}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${event.price}
                    </div>
                  </div>
                  {event.imageURL && (
                    <img src={event.imageURL} alt="Event graphic" className="w-full h-40 object-cover mt-2 rounded" />
                  )}
                  {event.canvaURL && (
                    <a href={event.canvaURL} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline">
                      View Canva Design
                    </a>
                  )}
                  {event.notes && (
                    <div className="mt-2 text-gray-700 text-sm">{event.notes}</div>
                  )}

                  <div className="mt-6 flex space-x-3">
                    <button
                      className="flex-1 bg-purple-500 text-white text-sm py-2 px-3 rounded hover:bg-purple-600"
                      onClick={() => saveTemplate(event)}
                    >
                      Save as Template
                    </button>
                    <button
                      className="flex-1 bg-gray-500 text-white text-sm py-2 px-3 rounded hover:bg-gray-600"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Event Modal - perfectly centered */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
              <div className="relative w-full max-w-lg p-5 border shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Event</h3>
                  <form className="space-y-4" onSubmit={addEvent}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                      <input
                        type="text"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={newEvent.date}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          name="time"
                          value={newEvent.time}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                      <select
                        name="type"
                        value={newEvent.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="tournament">Tournament</option>
                        <option value="lesson">Lesson</option>
                        <option value="practice">Practice</option>
                        <option value="special">Special Event</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <input
                        type="text"
                        name="course"
                        value={newEvent.course}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="E.g. Sunset Valley Par 3"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Players</label>
                        <input
                          type="number"
                          name="maxPlayers"
                          value={newEvent.maxPlayers}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="20"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={newEvent.price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="35"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Description</label>
                      <textarea
                        name="notes"
                        value={newEvent.notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Event details, rules, special info..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Graphic (Image URL)</label>
                      <input
                        type="text"
                        name="imageURL"
                        value={newEvent.imageURL}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://images.example.com/my-event.png"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Canva Design URL</label>
                      <input
                        type="text"
                        name="canvaURL"
                        value={newEvent.canvaURL}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.canva.com/design/your-design-id/view"
                      />
                      <a
                        href="https://www.canva.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm mt-1 block"
                      >
                        Open Canva to design an event flyer
                      </a>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      >
                        Create Event
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
