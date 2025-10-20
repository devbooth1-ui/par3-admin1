import React, { useState } from "react";

const samplePlayers = [
  {
    id: 1,
    name: "John Doe", 
    email: "john@email.com",
    totalPoints: 250,
    status: "Active",
    totalSpent: 120.00,
    gamesPlayed: 15,
    pendingClaims: 1
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@email.com", 
    totalPoints: 180,
    status: "Active", 
    totalSpent: 64.00,
    gamesPlayed: 8,
    pendingClaims: 0
  }
];

function PlayerManagementPreview() {
  const [players] = useState(samplePlayers);
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Player Management Preview</h1>
      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{player.name}</h3>
                  <p className="text-sm text-gray-600">{player.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{player.totalPoints} pts</div>
                    <div className="text-sm text-gray-500">${player.totalSpent}</div>
                  </div>
                  <button
                    onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    {expandedPlayer === player.id ? "▲ Less" : "▼ More"}
                  </button>
                </div>
              </div>
              
              {expandedPlayer === player.id && (
                <div className="mt-4 pt-4 border-t bg-gray-50 -m-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Game Stats</h4>
                      <p>Games Played: {player.gamesPlayed}</p>
                      <p>Status: {player.status}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Claims</h4>
                      <p>Pending: {player.pendingClaims}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerManagementPreview;
