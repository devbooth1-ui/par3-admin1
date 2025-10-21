import React, { useState, useEffect } from 'react';

// Sample player data based on our design
const samplePlayers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@email.com",
    phone: "555-123-4567",
    totalPoints: 250,
    status: "Active",
    lastActivity: "2 days ago",
    totalSpent: 120.00,
    gamesPlayed: 15,
    favoriteCourse: "Wentworth GC",
    achievements: {
      birdies: 3,
      holeInOnes: 1,
      pars: 11
    },
    pendingClaims: 1,
    qualificationStatus: "Qualified",
    emailTargets: ["tournament", "specials", "newsletter"]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@email.com",
    phone: "555-987-6543",
    totalPoints: 180,
    status: "Active",
    lastActivity: "1 week ago",
    totalSpent: 64.00,
    gamesPlayed: 8,
    favoriteCourse: "Royal Oak",
    achievements: {
      birdies: 2,
      holeInOnes: 0,
      pars: 6
    },
    pendingClaims: 0,
    qualificationStatus: "Need 20 more points",
    emailTargets: ["specials", "newsletter"]
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@email.com",
    phone: "555-456-7890",
    totalPoints: 420,
    status: "VIP",
    lastActivity: "Yesterday",
    totalSpent: 280.00,
    gamesPlayed: 35,
    favoriteCourse: "Wentworth GC",
    achievements: {
      birdies: 8,
      holeInOnes: 2,
      pars: 25
    },
    pendingClaims: 0,
    qualificationStatus: "Tournament Winner",
    emailTargets: ["tournament", "vip", "newsletter"]
  }
];

import React, { useState } from 'react';

// Sample player data
const samplePlayers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@email.com",
    totalPoints: 250,
    status: "Active",
    lastActivity: "2 days ago",
    totalSpent: 120.00,
    gamesPlayed: 15,
    pendingClaims: 1,
    qualificationStatus: "Qualified"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@email.com",
    totalPoints: 180,
    status: "Active",
    lastActivity: "1 week ago",
    totalSpent: 64.00,
    gamesPlayed: 8,
    pendingClaims: 0,
    qualificationStatus: "Need 20 more points"
  }
];

function PlayerManagementPreview() {
  const [players] = useState(samplePlayers);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Player Management Preview</h1>

      {/* Player Cards */}
      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{player.name}</h3>
                <p className="text-sm text-gray-600">{player.email}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{player.totalPoints} pts</div>
                <div className="text-sm text-gray-500">${player.totalSpent}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerManagementPreview;
