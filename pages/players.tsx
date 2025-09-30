import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

type PlayerStats = {
  lastRound?: string;
  totalRounds?: number;
  bestScore?: number;
  totalPoints?: number;
  lastReward?: string;
  lastDate?: string;
  holeInOneQualified?: boolean;
  tournamentQualified?: boolean;
  tournamentRegistered?: boolean;
};

type Player = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  stats?: PlayerStats;
};

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/players')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load players');
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-4">Players</h1>
        <p className="mb-6 text-gray-600">
          This player list is live from your backend. If something is missing, check your database/API.
        </p>
        {loading && <div>Loading players...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {players.length === 0 && !loading && <div>No players found.</div>}
        {players.map(player => (
          <div key={player._id} className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
            <p>Email: {player.email}</p>
            <p>Phone: {player.phone || 'N/A'}</p>
            <p>Current Points: {player.stats?.totalPoints ?? 0}</p>
            <p>
              Qualified for Tournament:{' '}
              <span className={player.stats?.tournamentQualified ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {player.stats?.tournamentQualified ? 'Yes' : 'No'}
              </span>
            </p>
            <p>Last Round: {player.stats?.lastRound ?? 'N/A'}</p>
            <p>Best Score: {player.stats?.bestScore ?? 'N/A'}</p>
            <p>Last Reward: {player.stats?.lastReward ?? 'N/A'}</p>
            <p>Last Date: {player.stats?.lastDate ?? 'N/A'}</p>
            <p>Hole-in-One Qualified: {player.stats?.holeInOneQualified ? 'Yes' : 'No'}</p>
            <p>Tournament Registered: {player.stats?.tournamentRegistered ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
