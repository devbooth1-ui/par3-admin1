import React from 'react';
import AdminLayout from '../components/AdminLayout';

export default function Players() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-4">Players</h1>
        <p className="mb-6 text-gray-600">Sample player data below. In production, this will be populated from the main app login and play data.</p>
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">John Doe</h2>
          <p>Email: johndoe@email.com</p>
          <p>Current Points: 18</p>
          <p>Qualified for Tournament: <span className="text-green-600 font-bold">No</span></p>
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Remind to Play</button>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Jane Smith</h2>
          <p>Email: janesmith@email.com</p>
          <p>Current Points: 22</p>
          <p>Qualified for Tournament: <span className="text-green-600 font-bold">Yes</span></p>
        </div>
      </div>
    </AdminLayout>
  );
}
